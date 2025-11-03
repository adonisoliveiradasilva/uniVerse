import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSetPasswordComponent } from './page-set-password';

describe('PageSetPassword', () => {
  let component: PageSetPasswordComponent;
  let fixture: ComponentFixture<PageSetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageSetPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageSetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
