import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPeriod } from './form-period';

describe('FormPeriod', () => {
  let component: FormPeriod;
  let fixture: ComponentFixture<FormPeriod>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPeriod]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPeriod);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
