import { TestBed } from '@angular/core/testing';

import { FullScreenService } from './full-screen.service';

describe('FullScreenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FullScreenService = TestBed.get(FullScreenService);
    expect(service).toBeTruthy();
  });
});
