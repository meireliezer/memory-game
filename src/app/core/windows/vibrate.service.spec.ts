import { TestBed } from '@angular/core/testing';

import { VibrateService } from './vibrate.service';

describe('VibrateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VibrateService = TestBed.get(VibrateService);
    expect(service).toBeTruthy();
  });
});
