import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyLogin } from './body-login';

describe('BodyLogin', () => {
  let component: BodyLogin;
  let fixture: ComponentFixture<BodyLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodyLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodyLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
