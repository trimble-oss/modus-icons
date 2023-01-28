import { TestBed } from '@angular/core/testing';

import { ModeSwitchService } from './mode-switch.service';

describe('ModeSwitchService', () => {
  let service: ModeSwitchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModeSwitchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
