import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleToggle } from './schedule-toggle';

describe('ScheduleToggle', () => {
  let component: ScheduleToggle;
  let fixture: ComponentFixture<ScheduleToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleToggle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleToggle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
