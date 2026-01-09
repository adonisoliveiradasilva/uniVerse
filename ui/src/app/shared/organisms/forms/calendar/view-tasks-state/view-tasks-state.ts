import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { switchMap, map, distinctUntilChanged, shareReplay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { isSameDay } from 'date-fns';
import { ScheduleService } from '../../../../../services/rxjs/schedule-service/schedule-service';
import { TaskService } from '../../../../../services/api/task-service/task-service';
import { ITask } from '../../../../../core/models/entitys/ITaskRequest.model';
import { IEventTag } from '../../../../../core/models/event-tag.model';
import { EVENT_TAGS } from '../../../../../core/data/event-tag.data';

@Component({
  selector: 'app-view-tasks-state',
  imports: [CommonModule],
  templateUrl: './view-tasks-state.html',
  styleUrl: './view-tasks-state.scss'
})
export class ViewTasksState implements OnInit {
  
  public scheduleService = inject(ScheduleService);
  private _taskService = inject(TaskService);

  public tasks$: Observable<ITask[]> | null = null;
  
  ngOnInit() {
    this.tasks$ = this.scheduleService.selectedDayState$.pipe(
      
      distinctUntilChanged((prev, curr) => {
         if (!prev && !curr) return true;
         if (!prev || !curr) return false;
         return isSameDay(prev, curr);
      }),

      switchMap(date => {
        if (!date) return of([]);

        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return this._taskService.getTasksByMonth(month, year).pipe(
          map(tasks => {
            return tasks.filter(t => {
                const taskDate = new Date(t.startDate); 
                return isSameDay(taskDate, date);
            });
          })
        );
      }),
      
      shareReplay(1) 
    );
  }

  selectTaskToEdit(task: ITask) {
    this.scheduleService.setTaskToEdit(task);
    
    this.scheduleService.changeState('edit_task');
  } 

  getTaskStyle(backendType: string): IEventTag {
    const type = backendType ? backendType.toUpperCase() : 'OUTROS';
    let targetSlug = 'others';

    switch (type) {
        case 'PROVA': targetSlug = 'test'; break;
        case 'TRABALHO': targetSlug = 'work'; break;
        case 'ATIVIDADE':
        case 'ESTUDO': targetSlug = 'task'; break;
        default: targetSlug = 'others'; break;
    }
    return EVENT_TAGS.find(t => t.slug === targetSlug) || EVENT_TAGS[3]; 
  }
}