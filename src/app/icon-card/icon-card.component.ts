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
  iconSubset: any;

  constructor(public iconService: IconService) {}

  ngOnInit(): void {
    this.iconService.getSet(this.set).subscribe((data) => {
      this.iconSet = data;
      this.iconSet.count = this.iconSet.icons.length;
      this.iconSubset = this.iconSet.icons.slice(0, this.number);
    });
  }
}
