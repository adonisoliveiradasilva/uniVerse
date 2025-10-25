import { TestBed } from '@angular/core/testing';

import { FormBusService } from './form-bus-service';

describe('FormBus', () => {
  let service: FormBusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormBusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
