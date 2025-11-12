import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePeriodSelectorLabel } from './date-period-selector-label';

describe('DatePeriodSelectorLabel', () => {
  let component: DatePeriodSelectorLabel;
  let fixture: ComponentFixture<DatePeriodSelectorLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePeriodSelectorLabel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatePeriodSelectorLabel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
