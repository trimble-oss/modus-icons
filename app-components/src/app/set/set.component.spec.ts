import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { of } from 'rxjs';

import { SetComponent } from './set.component';
import { FilterPipe } from '../_pipes/filter.pipe';
import { IconService } from '../icon.service';

describe('SetComponent', () => {
  let component: SetComponent;
  let fixture: ComponentFixture<SetComponent>;
  let mockIconService: jasmine.SpyObj<IconService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('IconService', ['getSet']);

    await TestBed.configureTestingModule({
      declarations: [ SetComponent, FilterPipe ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        BrowserAnimationsModule,
        BsDropdownModule
      ],
      providers: [
        { provide: IconService, useValue: spy }
      ]
    })
    .compileComponents();

    mockIconService = TestBed.inject(IconService) as jasmine.SpyObj<IconService>;
  });

  beforeEach(() => {
    // Mock the service response
    mockIconService.getSet.and.returnValue(of({
      setName: 'test-set',
      displayName: 'Test Set',
      icons: [
        {
          name: 'test-icon',
          displayName: 'Test Icon',
          categories: ['test'],
          tags: ['test']
        }
      ]
    }));

    fixture = TestBed.createComponent(SetComponent);
    component = fixture.componentInstance;
    component.setname = 'test-set'; // Provide required input
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
