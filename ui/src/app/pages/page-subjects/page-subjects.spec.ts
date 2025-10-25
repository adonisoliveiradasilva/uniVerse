import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSubjects } from './page-subjects';

describe('PageSubjects', () => {
  let component: PageSubjects;
  let fixture: ComponentFixture<PageSubjects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageSubjects]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageSubjects);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
