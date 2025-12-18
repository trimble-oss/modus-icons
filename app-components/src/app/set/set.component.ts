import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IconService } from '../icon.service';

@Component({
  selector: 'app-set',
  templateUrl: './set.component.html',
  styleUrls: ['./set.component.scss'],
  standalone: false,
})
export class SetComponent implements OnInit {
  @Input() setname: string;
  @Input() assetpath? = '/';
  @Input() categories? = 'true';
  iconSet: any;
  iconSetCats: any;
  categoryList: any[] = [];
  selectedCategory = 'All';
  hasCategories: boolean;
  showCategories = true;
  filterTerm = '';
  fontCssUrl: SafeResourceUrl;

  constructor(
    public iconService: IconService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    if (window.location.search) {
      const params = new URLSearchParams(window.location.search);
      if (params.get('filter'))
        this.filterTerm = decodeURIComponent(params.get('filter')) || '';
      if (params.get('category'))
        this.selectedCategory =
          decodeURIComponent(params.get('category')) || 'All';
    }
    this.hasCategories = this.categories === 'true';
    this.iconService.getSet(this.setname).subscribe((data) => {
      this.iconSet = data;
      this.iconSet.icons.forEach((icon) => {
        const iconCategories = icon.categories.join(', ');
        if (!this.categoryList.includes(iconCategories)) {
          this.categoryList.push(iconCategories);
        }
      });
      this.categoryList.sort();
      this.iconSetCats = this.categoryList.map((cat) => {
        return {
          name: cat,
          icons: this.iconSet.icons.filter((icon) => {
            return icon.categories.join(', ') === cat;
          }),
        };
      });
      this.categoryList.unshift('All');
      if (!this.categoryList.includes(this.selectedCategory)) {
        this.selectedCategory = 'All';
      }
      this.fontCssUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `${this.assetpath + (this.assetpath !== '') ? '/' : ''}/${
          this.iconSet.setName
        }/fonts/modus-icons.css`
      );
    });
  }

  filterIcons(term: string): void {
    this.filterTerm = term;
    if (term === '') {
      window.history.replaceState(null, null, window.location.pathname);
    } else {
      window.history.replaceState(
        null,
        null,
        `?filter=${encodeURIComponent(term)}`
      );
    }
  }

  selectCategory(cat: string): void {
    this.selectedCategory = cat;
    this.showCategories = true;
    if (cat === 'All') {
      window.history.replaceState(null, null, window.location.pathname);
    } else {
      window.history.replaceState(
        null,
        null,
        `?category=${encodeURIComponent(cat)}`
      );
    }
  }
}
