import { TestBed } from '@angular/core/testing';

import { DuphluxService } from './duphlux.service';

describe('DuphluxService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DuphluxService = TestBed.get(DuphluxService);
    expect(service).toBeTruthy();
  });
});
