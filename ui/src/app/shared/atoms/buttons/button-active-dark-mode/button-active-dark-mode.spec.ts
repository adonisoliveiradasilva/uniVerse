import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonActiveDarkMode } from './button-active-dark-mode';

describe('ButtonActiveDarkMode', () => {
  let component: ButtonActiveDarkMode;
  let fixture: ComponentFixture<ButtonActiveDarkMode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonActiveDarkMode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonActiveDarkMode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
