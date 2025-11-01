import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageUsers } from './page-users';

describe('PageUsers', () => {
  let component: PageUsers;
  let fixture: ComponentFixture<PageUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
