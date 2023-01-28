import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModusAppBrandingComponent } from './modus-app-branding.component';

describe('ModusAppBrandingComponent', () => {
  let component: ModusAppBrandingComponent;
  let fixture: ComponentFixture<ModusAppBrandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModusAppBrandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModusAppBrandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
