import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, format, isSameMonth, isSameDay 
} from 'date-fns';
import { Subscription } from 'rxjs';

import { ICalendarDay } from '../../../core/models/calendar-day.model';
import { ScheduleService } from '../../../services/rxjs/schedule-service/schedule-service';
import { TaskService } from '../../../services/api/task-service/task-service';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss'
})
export class Calendar implements OnInit, OnChanges, OnDestroy {
  @Input() currentDate: Date = new Date();
  @Output() dateSelected = new EventEmitter<Date>();

  calendarDays: ICalendarDay[] = [];
  weekDays: string[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  selectedDate: Date | null = null;

  public _scheduleService = inject(ScheduleService);
  private _taskService = inject(TaskService);

  private subscription: Subscription = new Subscription();

  ngOnInit() {
    this._generateCalendar();
    this._listenToSelectedDate();
    this._fetchTasksForMonth();

    const refreshSub = this._scheduleService.refreshCalendar$.subscribe(() => {
        this._fetchTasksForMonth();
    });
    this.subscription.add(refreshSub);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentDate']) {
      this._generateCalendar();
      this._fetchTasksForMonth();
    }
  }

  private _generateCalendar() {
    const monthStart = startOfMonth(this.currentDate);
    const monthEnd = endOfMonth(this.currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const daysInterval = eachDayOfInterval({ start: startDate, end: endDate });

    this.calendarDays = daysInterval.map(day => {
      return {
        date: day,
        dayNumber: format(day, 'd'),
        isCurrentMonth: isSameMonth(day, monthStart),
        isToday: isSameDay(day, new Date()),
        taskCount: 0 // Inicializa com 0
      };
    });
  }

  private _fetchTasksForMonth() {
    const month = this.currentDate.getMonth() + 1;
    const year = this.currentDate.getFullYear();

    const sub = this._taskService.getTasksByMonth(month, year).subscribe({
      next: (tasks) => {
        this.calendarDays.forEach(day => {
          const count = tasks.filter(t => isSameDay(new Date(t.startDate), day.date)).length;
          day.taskCount = count;
        });
      },
      error: (err) => console.error('Erro ao buscar contagem de tarefas', err)
    });

    this.subscription.add(sub);
  }

  onDayClick(day: ICalendarDay) {
    this.dateSelected.emit(day.date);
    this._scheduleService.selectDay(day.date);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  checkIsSelected(dayDate: Date): boolean {
    if (!this.selectedDate) return false;
    return isSameDay(dayDate, this.selectedDate);
  }

  private _listenToSelectedDate() {
    const sub = this._scheduleService.selectedDayState$
      .subscribe(selectedDate => {
        this.selectedDate = selectedDate;
      });
    
    this.subscription.add(sub);
  }
}