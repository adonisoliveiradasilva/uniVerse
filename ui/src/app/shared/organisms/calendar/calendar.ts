import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ICalendarDay } from '../../../core/models/calendar-day.model';
import { Subscription } from 'rxjs';
import { ScheduleService } from '../../../services/rxjs/schedule-service/schedule-service';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss'
})
export class Calendar implements OnInit, OnChanges {
  @Input() currentDate: Date = new Date();
  @Output() dateSelected = new EventEmitter<Date>();

  calendarDays: ICalendarDay[] = [];
  weekDays: string[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  selectedDate: Date | null = null;

  public _scheduleService = inject(ScheduleService);

  private subscription: Subscription = new Subscription();

  ngOnInit() {
    this._generateCalendar();
    this._listenToSelectedDate();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentDate']) {
      this._generateCalendar();
    }
  }

  private _generateCalendar() {
    const monthStart = startOfMonth(this.currentDate);
    const monthEnd = endOfMonth(this.currentDate);

    const startDate = startOfWeek(monthStart);
    
    const endDate = endOfWeek(monthEnd);

    const daysInterval = eachDayOfInterval({
      start: startDate,
      end: endDate
    });

    this.calendarDays = daysInterval.map(day => {
      return {
        date: day,
        dayNumber: format(day, 'd'),
        isCurrentMonth: isSameMonth(day, monthStart),
        isToday: isSameDay(day, new Date())
      };
    });
  }

  onDayClick(day: ICalendarDay) {
    this.dateSelected.emit(day.date);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  checkIsSelected(dayDate: Date): boolean {
    if (!this.selectedDate) return false;
    return isSameDay(dayDate, this.selectedDate);
  }

  private _listenToSelectedDate() {
    const sub = this._scheduleService.selectedDayState$
      .subscribe(selectedDate => {
        this.selectedDate = selectedDate;

        if (selectedDate) {
          const formatedDate = format(selectedDate, 'dd/MM/yyyy');
          console.log('Data selecionada (Reativo):', formatedDate);
        }
      });
    
    this.subscription.add(sub);
  }
}