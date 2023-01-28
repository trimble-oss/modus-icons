import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DropdownModule } from 'modus-dropdown';

import { ModusAppBrandingComponent } from './modus-app-branding/modus-app-branding.component';
import { ModeSwitchComponent } from './mode-switch/mode-switch.component';
import { HomeComponent } from './home/home.component';
import { SetComponent } from './set/set.component';
import { DetailComponent } from './detail/detail.component';
import { IconCardComponent } from './icon-card/icon-card.component';
import { SearchComponent } from './search/search.component';
@NgModule({
  declarations: [AppComponent, ModusAppBrandingComponent, ModeSwitchComponent, HomeComponent, SetComponent, DetailComponent, IconCardComponent, SearchComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DropdownModule,
    TypeaheadModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
