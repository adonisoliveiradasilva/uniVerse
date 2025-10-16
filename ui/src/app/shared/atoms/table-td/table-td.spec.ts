import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTd } from './table-td';

describe('TableTd', () => {
  let component: TableTd;
  let fixture: ComponentFixture<TableTd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableTd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableTd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
