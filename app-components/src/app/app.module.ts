import {
  ApplicationRef,
  DoBootstrap,
  Injector,
  NgModule,
} from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { SearchComponent } from './search/search.component';
import { SetComponent } from './set/set.component';
import { SvgcssComponent } from './svgcss/svgcss.component';
import { FilterPipe } from './_pipes/filter.pipe';

@NgModule({
    declarations: [SearchComponent, SetComponent, FilterPipe, SvgcssComponent],
    imports: [
        BrowserModule,
        FormsModule,
    ],
    providers: [
    // { provide: OverlayContainer, useClass: CdkOverlayContainer }
    ]
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {}

  ngDoBootstrap(_appRef: ApplicationRef): void {
    // Register after the module graph is fully initialized (constructor is too early
    // and can cause TDZ / "Cannot access before initialization" in production bundles).
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
}
