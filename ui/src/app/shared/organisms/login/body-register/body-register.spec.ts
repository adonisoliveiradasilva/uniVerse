import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyRegister } from './body-register';

describe('BodyRegister', () => {
  let component: BodyRegister;
  let fixture: ComponentFixture<BodyRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodyRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodyRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
