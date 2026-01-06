import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentScheduleClass } from './component-schedule-class';

describe('ComponentScheduleClass', () => {
  let component: ComponentScheduleClass;
  let fixture: ComponentFixture<ComponentScheduleClass>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentScheduleClass]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentScheduleClass);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
