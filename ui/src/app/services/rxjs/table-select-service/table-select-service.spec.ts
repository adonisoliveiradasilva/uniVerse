import { TestBed } from '@angular/core/testing';

import { TableSelectService } from './table-select-service';

describe('TableSelectService', () => {
  let service: TableSelectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableSelectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
