import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePeriods } from './page-periods';

describe('PagePeriods', () => {
  let component: PagePeriods;
  let fixture: ComponentFixture<PagePeriods>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagePeriods]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagePeriods);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
