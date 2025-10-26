import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCourse } from './form-course';

describe('FormCourse', () => {
  let component: FormCourse;
  let fixture: ComponentFixture<FormCourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCourse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCourse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
