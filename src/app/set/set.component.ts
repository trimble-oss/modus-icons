import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IconService } from '../_services/icon.service';

@Component({
  selector: 'app-set',
  templateUrl: './set.component.html',
  styleUrls: ['./set.component.scss'],
})
export class SetComponent implements OnInit {
  iconSet: any;
  iconSetCategories: any[] = [];
  showCategories = true;
  fontCssUrl: SafeResourceUrl;

  constructor(
    public iconService: IconService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.iconService.getSet(params['setName']).subscribe((data) => {
        this.iconSet = data;
        this.iconSet.icons.forEach((icon) => {
          let iconCategories = icon.categories.join(', ');
          if (iconCategories === '') {
            iconCategories = 'No Category';
          }
          if (!this.iconSetCategories.includes(iconCategories)) {
            this.iconSetCategories.push(iconCategories);
          }
        });
        this.iconSetCategories.sort();
        this.fontCssUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `../../assets/${this.iconSet.setName}/fonts/modus-icons.css`
        );
        document.title = `${this.iconSet.displayName} - Modus Icons`;
      });
    });
  }
}
