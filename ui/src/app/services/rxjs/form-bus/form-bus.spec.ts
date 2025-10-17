import { TestBed } from '@angular/core/testing';

import { FormBus } from './form-bus';

describe('FormBus', () => {
  let service: FormBus;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormBus);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
