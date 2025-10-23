import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertSurface } from './alert-surface';

describe('AlertSurface', () => {
  let component: AlertSurface;
  let fixture: ComponentFixture<AlertSurface>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertSurface]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertSurface);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
