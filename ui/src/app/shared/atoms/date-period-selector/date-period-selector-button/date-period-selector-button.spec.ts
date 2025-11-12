import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePeriodSelectorButton } from './date-period-selector-button';

describe('DatePeriodSelectorButton', () => {
  let component: DatePeriodSelectorButton;
  let fixture: ComponentFixture<DatePeriodSelectorButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePeriodSelectorButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatePeriodSelectorButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
