import { TestBed } from '@angular/core/testing';

import { FormModal } from './form-modal-service';

describe('FormModal', () => {
  let service: FormModal;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormModal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
