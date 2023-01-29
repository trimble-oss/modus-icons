import { Component, OnInit } from '@angular/core';
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

  constructor(public iconService: IconService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.setName = params['setName'];
      this.setDisplayName = this.iconService.getSetDisplayName(this.setName);
      this.icon = this.iconService.getIcon(this.setName, params['iconName']);
      this.iconCats = this.icon.categories.join(', ');
      this.iconTags = this.icon.tags.join(', ');
      this.ligature = this.icon.name.replace(/-/g, '_');
      document.title = `${this.icon.displayName} - ${this.setDisplayName} - Modus Icons`;
      const styleElem = document.createElement('link') as HTMLElement;
      styleElem.setAttribute(
        'href',
        `../../assets/${this.setName}/fonts/modus-icons.css`
      );
      document.getElementById('content').prepend(styleElem);
    });
  }

  encodeUrlParam(param: string): string {
    return encodeURIComponent(param);
  }
}
