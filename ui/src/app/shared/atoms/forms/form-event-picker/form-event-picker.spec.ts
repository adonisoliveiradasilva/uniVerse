import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEventPicker } from './form-event-picker';

describe('FormEventPicker', () => {
  let component: FormEventPicker;
  let fixture: ComponentFixture<FormEventPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormEventPicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormEventPicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
