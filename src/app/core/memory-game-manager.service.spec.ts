import { TestBed } from '@angular/core/testing';

import { MemoryGameManagerService } from './memory-game-manager.service';

describe('MemoryGameManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MemoryGameManagerService = TestBed.get(MemoryGameManagerService);
    expect(service).toBeTruthy();
  });
});
