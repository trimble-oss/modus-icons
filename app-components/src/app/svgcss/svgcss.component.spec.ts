import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgcssComponent } from './svgcss.component';

describe('SvgcssComponent', () => {
  let component: SvgcssComponent;
  let fixture: ComponentFixture<SvgcssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SvgcssComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgcssComponent);
    component = fixture.componentInstance;
    component.svg = '<svg><circle cx="50" cy="50" r="40" /></svg>'; // Provide required input
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
