import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePeriodSelector } from './date-period-selector';

describe('DatePeriodSelector', () => {
  let component: DatePeriodSelector;
  let fixture: ComponentFixture<DatePeriodSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePeriodSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatePeriodSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
