import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '../../shared/organisms/calendar/calendar';
import { FormCalendarTemplate } from '../form-calendar-template/form-calendar-template';
import { ScheduleService } from '../../services/rxjs/schedule-service/schedule-service';

export type ComponentState = 'void' | 'view_tasks' | 'new_task' | 'edit_task' | 'delete_task';

@Component({
  selector: 'app-component-tasks',
  imports: [CommonModule, Calendar, FormCalendarTemplate],
  templateUrl: './component-tasks.html',
  styleUrl: './component-tasks.scss'
})
export class ComponentTasks {
  currentDate: Date = new Date();
  currentMonthLabel: string = '';

  public _scheduleService = inject(ScheduleService);

  ngOnInit() {
    this._updateLabel();
  }

  prevMonth() {
    this.currentDate = subMonths(this.currentDate, 1);
    this._updateLabel();
  }

  nextMonth() {
    this.currentDate = addMonths(this.currentDate, 1);
    this._updateLabel();
  }

  onDateSelected(date: Date) {
    this._scheduleService.selectDay(date);
    this.changeState('view_tasks');
  }

  changeState(newState: ComponentState) {
    this._scheduleService.changeState(newState);
  }

  private _updateLabel() {
    const label = format(this.currentDate, "MMMM 'de' yyyy", { locale: ptBR });
    this.currentMonthLabel = label.charAt(0).toUpperCase() + label.slice(1);
  }

}