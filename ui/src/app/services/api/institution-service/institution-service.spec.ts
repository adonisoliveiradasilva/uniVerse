import { TestBed } from '@angular/core/testing';

import { InstitutionService } from './institution-service';

describe('Institution', () => {
  let service: InstitutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstitutionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
