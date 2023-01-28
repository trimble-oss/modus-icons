import { DOCUMENT } from '@angular/common';
import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModeSwitchService {
  darkMode = new BehaviorSubject<boolean>(false);

  constructor(@Inject(DOCUMENT) private document: Document) {}

  setDarkMode(dark: boolean) {
    const styleName = dark ? 'modus-dark.css' : 'modus-light.css';
    const head = this.document.getElementsByTagName('head')[0];

    const themeLink = this.document.getElementById(
      'client-theme'
    ) as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = styleName;
    } else {
      const style = this.document.createElement('link');
      style.id = 'client-theme';
      style.rel = 'stylesheet';
      style.href = `${styleName}`;

      head.appendChild(style);
    }
    this.document.body.classList.toggle('dark-mode', dark);
    this.darkMode.next(dark);
    localStorage.setItem('dark-mode', dark.toString());
  }

  getDarkMode(): Observable<boolean> {
    return this.darkMode.asObservable();
  }
}
