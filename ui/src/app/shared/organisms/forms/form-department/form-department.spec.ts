import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDepartment } from './form-department';

describe('FormDepartment', () => {
  let component: FormDepartment;
  let fixture: ComponentFixture<FormDepartment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDepartment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDepartment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
