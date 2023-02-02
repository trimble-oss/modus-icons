import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [SearchComponent],
  imports: [BrowserModule, FormsModule],
  entryComponents: [SearchComponent],
  providers: [],
})
export class AppModule {
  constructor(private injector: Injector) {
    const searchElement = createCustomElement(SearchComponent, {
      injector: this.injector,
    });
    customElements.define('site-search', searchElement);
  }
  ngDoBootstrap() {}
}
