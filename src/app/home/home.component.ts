import { Component, OnInit } from '@angular/core';
import { IconService } from '../_services/icon.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  iconSets = this.iconService.getSetList();

  constructor(public iconService: IconService) {}

  ngOnInit(): void {}
}
