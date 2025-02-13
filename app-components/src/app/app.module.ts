import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { SearchComponent } from './search/search.component';
import { SetComponent } from './set/set.component';
import { SvgcssComponent } from './svgcss/svgcss.component';
import { FilterPipe } from './_pipes/filter.pipe';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [SearchComponent, SetComponent, FilterPipe, SvgcssComponent],
    imports: [
        BrowserModule,
        FormsModule,
        BsDropdownModule.forRoot(),
        BrowserAnimationsModule,
    ],
    providers: [
    // { provide: OverlayContainer, useClass: CdkOverlayContainer }
    ]
})
export class AppModule {
  constructor(private injector: Injector) {
    const searchElement = createCustomElement(SearchComponent, {
      injector: this.injector,
    });
    customElements.define('site-search', searchElement);

    const setElement = createCustomElement(SetComponent, {
      injector: this.injector,
    });
    customElements.define('icon-set-list', setElement);

    const svgcssElement = createCustomElement(SvgcssComponent, {
      injector: this.injector,
    });
    customElements.define('svg-css', svgcssElement);
  }
  ngDoBootstrap() {}
}
