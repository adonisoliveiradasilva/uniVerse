import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConfirmDisplayDelete } from './form-confirm-display-delete';

describe('FormConfirmDisplayDelete', () => {
  let component: FormConfirmDisplayDelete;
  let fixture: ComponentFixture<FormConfirmDisplayDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormConfirmDisplayDelete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormConfirmDisplayDelete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
