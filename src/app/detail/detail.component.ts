import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IconService } from '../_services/icon.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  setName: string;
  setDisplayName: string;
  icon: any;
  iconCats: string;
  iconTags: string;
  ligature: string;
  fontCssUrl: string | SafeResourceUrl;

  constructor(
    public iconService: IconService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.setName = params['setName'];
      this.setDisplayName = this.iconService.getSetDisplayName(this.setName);
      this.iconService
        .getIcon(this.setName, params['iconName'])
        .subscribe((data) => {
          this.icon = data;
          this.iconCats = this.icon.categories.join(', ');
          this.iconTags = this.icon.tags.join(', ');
          this.ligature = this.icon.name.replace(/-/g, '_');
          this.fontCssUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            `../../assets/${this.setName}/fonts/modus-icons.css`
          );
          document.title = `${this.icon.displayName} - ${this.setDisplayName} - Modus Icons`;
        });
    });
  }

  encodeUrlParam(param: string): string {
    return encodeURIComponent(param);
  }
}
