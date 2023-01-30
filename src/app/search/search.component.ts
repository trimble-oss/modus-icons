import { Component, OnInit } from '@angular/core';
import { IconService } from '../_services/icon.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchResults: any;
  searchString: string;

  constructor(private iconService: IconService) {}

  ngOnInit(): void {}

  search() {
    this.iconService.searchIcons(this.searchString).subscribe((results) => {
      this.searchResults = results;
    });
  }
}
