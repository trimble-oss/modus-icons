import { Component, OnInit, Input } from '@angular/core';
import { IconService } from '../_services/icon.service';

@Component({
  selector: 'app-icon-card',
  templateUrl: './icon-card.component.html',
  styleUrls: ['./icon-card.component.scss'],
})
export class IconCardComponent implements OnInit {
  @Input() set: string;
  @Input() number: number = 40;
  iconSet: any;

  constructor(public iconService: IconService) {}

  ngOnInit(): void {
    this.iconSet = this.iconService.getSet(this.set);
    this.iconSet.count = this.iconSet.icons.length;
    this.iconSet.icons = this.iconSet.icons.slice(0, this.number);
  }
}
