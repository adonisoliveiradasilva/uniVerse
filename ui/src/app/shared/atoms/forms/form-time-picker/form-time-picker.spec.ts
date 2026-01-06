import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTimePicker } from './form-time-picker';

describe('FormTimePicker', () => {
  let component: FormTimePicker;
  let fixture: ComponentFixture<FormTimePicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTimePicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTimePicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
