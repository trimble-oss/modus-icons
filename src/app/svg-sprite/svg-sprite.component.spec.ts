import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgSpriteComponent } from './svg-sprite.component';

describe('SvgSpriteComponent', () => {
  let component: SvgSpriteComponent;
  let fixture: ComponentFixture<SvgSpriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SvgSpriteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgSpriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
