import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-schedule-toggle',
  imports: [],
  templateUrl: './schedule-toggle.html',
  styleUrl: './schedule-toggle.scss'
})
export class ScheduleToggle {
  @Output() navigate = new EventEmitter<'tasks' | 'class_schedule'>();
  toggledSlug: string | null = null;

  onClick(slug: string): void {
    if(slug === this.toggledSlug) {
      return;
    }

    this.toggledSlug = slug;
    this.navigate.emit(this.toggledSlug as 'tasks' | 'class_schedule');
  }

  ngOnInit(): void {
    this.onClick('tasks');
  }

}
