import { Component, Inject, Input, OnInit } from '@angular/core';
import { ModeSwitchService } from './mode-switch.service';

@Component({
  selector: 'app-mode-switch',
  templateUrl: './mode-switch.component.html',
  styles: [],
})
export class ModeSwitchComponent implements OnInit {
  @Input() leftNav = true;
  isDark = false;

  constructor(private modeSwitchService: ModeSwitchService) {}

  ngOnInit(): void {
    if (localStorage.getItem('dark-mode') === 'true') {
      this.isDark = true;
    }
    this.modeSwitchService.setDarkMode(this.isDark);
  }

  toggleMode() {
    this.isDark = !this.isDark;
    this.modeSwitchService.setDarkMode(this.isDark);
  }
}
