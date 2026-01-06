import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSchedule } from './page-schedule';

describe('PageSchedule', () => {
  let component: PageSchedule;
  let fixture: ComponentFixture<PageSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageSchedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageSchedule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
