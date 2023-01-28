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
@NgModule({
  declarations: [AppComponent, ModusAppBrandingComponent, ModeSwitchComponent],
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
