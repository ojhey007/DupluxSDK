import { TestBed } from '@angular/core/testing';

import { UUIDServiceService } from './uuidservice.service';

describe('UUIDServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UUIDServiceService = TestBed.get(UUIDServiceService);
    expect(service).toBeTruthy();
  });
});
