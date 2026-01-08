import { Component } from '@angular/core';
import { ScheduleToggle } from '../../shared/molecules/schedule-toggle/schedule-toggle';
import { BehaviorSubject } from 'rxjs';
import { ComponentTasks } from '../../templates/component-tasks/component-tasks';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-schedule',
  imports: [ScheduleToggle, ComponentTasks, CommonModule],
  templateUrl: './page-schedule.html',
  styleUrl: './page-schedule.scss'
})
export class PageSchedule {
  private viewSubject = new BehaviorSubject<'tasks' | 'class_schedule'>('tasks');
  view$ = this.viewSubject.asObservable();

  navigate(navigate: 'tasks' | 'class_schedule'): void { 
    this.viewSubject.next(navigate);
  }
}
