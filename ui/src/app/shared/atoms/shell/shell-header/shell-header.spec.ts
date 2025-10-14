import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellHeader } from './shell-header';

describe('ShellHeader', () => {
  let component: ShellHeader;
  let fixture: ComponentFixture<ShellHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShellHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
