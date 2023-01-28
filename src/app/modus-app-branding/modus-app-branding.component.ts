import { Component, Input, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'modus-app-branding',
  templateUrl: './modus-app-branding.component.html',
  styles: [
    `
      .app-logo {
        height: 24px;
      }

      h1.app-name {
        font-weight: 400;
        color: #004f83;
        font-size: 22px;
        position: relative;
        margin-bottom: 1px;
      }

      h1.app-name-white {
        color: #fff !important;
      }
    `,
  ],
})
export class ModusAppBrandingComponent implements OnInit {
  @HostBinding('class') class = 'mr-auto';
  @Input() appName?: string;
  @Input() logoPath?: string;
  @Input() logoAlt?: string;
  @Input() badge?: string;
  isBlue = false;

  ngOnInit(): void {
    this.isBlue = document.querySelectorAll('.navbar-blue').length > 0;
  }
}
