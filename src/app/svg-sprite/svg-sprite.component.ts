import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'modus-svg-sprite',
  template: `<svg
    [attr.class]="'modus-icon ' + class"
    [attr.width]="size"
    [attr.height]="size"
    fill="currentcolor"
  >
    <use
      [attr.xlink:href]="
        '../../assets/' + setName + '/sprites/modus-icons.svg#' + icon
      "
    ></use>
  </svg>`,
})
export class SvgSpriteComponent {
  @Input() setName: string;
  @Input() icon: string;
  @Input() size? = '24';
  @Input() class? = '';
}
