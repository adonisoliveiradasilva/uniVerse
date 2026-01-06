import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCalendarTemplate } from './form-calendar-template';

describe('FormCalendarTemplate', () => {
  let component: FormCalendarTemplate;
  let fixture: ComponentFixture<FormCalendarTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCalendarTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCalendarTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
