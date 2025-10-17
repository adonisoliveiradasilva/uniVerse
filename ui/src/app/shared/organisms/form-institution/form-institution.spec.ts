import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInstitution } from './form-institution';

describe('FormInstitution', () => {
  let component: FormInstitution;
  let fixture: ComponentFixture<FormInstitution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInstitution]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormInstitution);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
