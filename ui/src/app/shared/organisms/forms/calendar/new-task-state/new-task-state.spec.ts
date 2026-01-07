import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTaskState } from './new-task-state';

describe('NewTaskState', () => {
  let component: NewTaskState;
  let fixture: ComponentFixture<NewTaskState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewTaskState]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTaskState);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
