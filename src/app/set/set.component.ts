import { Component, OnInit } from '@angular/core';
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

  constructor(public iconService: IconService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.iconSet = this.iconService.getSet(params['setName']);
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
    });
  }
}
