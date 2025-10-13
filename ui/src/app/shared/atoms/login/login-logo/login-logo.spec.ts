import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginLogo } from './login-logo';

describe('LoginLogo', () => {
  let component: LoginLogo;
  let fixture: ComponentFixture<LoginLogo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginLogo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginLogo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
