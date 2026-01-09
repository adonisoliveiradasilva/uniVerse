import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ITask } from '../../../core/models/entitys/ITaskRequest.model';

export type ScheduleViewState = 'void' | 'tasks' | 'class_schedule' | 'view_tasks' | 'view_class_schedule' | 'new_task' | 'new_class_schedule' | 'edit_task' | 'edit_class_schedule' | 'delete_task' | 'delete_class_schedule';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private _viewState$ = new BehaviorSubject<ScheduleViewState>('void');
  public viewState$ = this._viewState$.asObservable();

  private _selectedDayState$ = new BehaviorSubject<Date | null>(null);
  public selectedDayState$ = this._selectedDayState$.asObservable();

  private _refreshCalendar$ = new Subject<void>();
  public refreshCalendar$ = this._refreshCalendar$.asObservable();

  private _taskToEdit$ = new BehaviorSubject<ITask | null>(null);
  public taskToEdit$ = this._taskToEdit$.asObservable();

  constructor() { }

  public get currentViewState(): ScheduleViewState {
    return this._viewState$.value;
  }

  public changeState(newState: ScheduleViewState) {
    this._viewState$.next(newState);
  }

  public close() {
    this._viewState$.next('void');
  }

  public selectDay(date: Date | null) {
    this._selectedDayState$.next(date);
  }

  public notifyCalendarRefresh() {
    this._refreshCalendar$.next();
  }

  public setTaskToEdit(task: ITask) {
    this._taskToEdit$.next(task);
  }

  public clearTaskToEdit() {
    this._taskToEdit$.next(null);
  }
}
