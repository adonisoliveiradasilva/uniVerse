import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTasksState } from './view-tasks-state';

describe('ViewTasksState', () => {
  let component: ViewTasksState;
  let fixture: ComponentFixture<ViewTasksState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTasksState]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTasksState);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
