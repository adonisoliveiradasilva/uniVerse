import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSubject } from './form-subject';

describe('FormSubject', () => {
  let component: FormSubject;
  let fixture: ComponentFixture<FormSubject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSubject]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormSubject);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
