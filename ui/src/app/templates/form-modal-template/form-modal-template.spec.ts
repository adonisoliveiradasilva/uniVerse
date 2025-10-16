import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormModalTemplate } from './form-modal-template';

describe('FormModalTemplate', () => {
  let component: FormModalTemplate;
  let fixture: ComponentFixture<FormModalTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormModalTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormModalTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
