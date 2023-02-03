import { Component, OnInit, Input } from '@angular/core';
import { IconService } from '../icon.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Input() basehref? = '';
  @Input() assetpath? = '/';
  searchResults: any[] = [];
  searchString = '';

  constructor(private iconService: IconService) {}

  ngOnInit(): void {}

  search() {
    this.iconService.searchIcons(this.searchString).subscribe((results) => {
      this.searchResults = results
        .map((result) => {
          const icon = { ...result };
          icon.tags = icon.tags.join(', ');
          return icon;
        })
        .sort((a, b) => a.name.localeCompare(b.name));
    });
  }
}
