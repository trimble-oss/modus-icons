import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetComponent } from './set.component';

describe('SetComponent', () => {
  let component: SetComponent;
  let fixture: ComponentFixture<SetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
