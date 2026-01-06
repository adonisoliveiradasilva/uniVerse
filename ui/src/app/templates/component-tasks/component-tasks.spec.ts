import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentTasks } from './component-tasks';

describe('ComponentTasks', () => {
  let component: ComponentTasks;
  let fixture: ComponentFixture<ComponentTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentTasks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentTasks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
