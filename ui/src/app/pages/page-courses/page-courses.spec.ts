import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCourses } from './page-courses';

describe('PageCourses', () => {
  let component: PageCourses;
  let fixture: ComponentFixture<PageCourses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageCourses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageCourses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
