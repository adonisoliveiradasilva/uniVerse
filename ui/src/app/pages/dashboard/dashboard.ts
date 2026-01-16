import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { isSameDay, startOfDay } from 'date-fns';
import { TaskService } from '../../services/api/task-service/task-service';
import { PeriodService } from '../../services/api/period-service/period-service';
import { ITask } from '../../core/models/entitys/ITaskRequest.model';
import { IPeriod } from '../../core/models/entitys/IPeriod.model';
import { IEnrolledSubject } from '../../core/models/entitys/IPeriod.model';
import { IEventTag } from '../../core/models/event-tag.model';
import { EVENT_TAGS } from '../../core/data/event-tag.data';
import { SubjectService } from '../../services/api/subject-service/subject-service';
import { ISubject } from '../../core/models/entitys/ISubject.model';
import { ITableRow } from '../../core/models/table.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  
  private _taskService = inject(TaskService);
  private _periodService = inject(PeriodService);
  private _subjectService = inject(SubjectService);

  todayDate = new Date();
  
  pendingTasksCount: number = 0;
  globalAverage: number = 0;

  todayTasks: any[] = [];
  currentSubjects: IEnrolledSubject[] = [];

  ngOnInit() {
    this._loadDashboardData();
  }

  private _loadDashboardData() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    forkJoin({
      tasks: this._taskService.getTasksByMonth(currentMonth, currentYear),
      periods: this._periodService.fetchAllPeriods(),
      average: this._periodService.getGlobalAverage(),
      allSubjects: this._subjectService.fetchSubjects()
    }).subscribe({
      next: (data) => {
        this._processTasks(data.tasks);
        this._processPeriods(data.periods, data.allSubjects);
        
        this.globalAverage = data.average || 0;
      },
      error: (err) => console.error('Erro crítico no dashboard', err)
    });
  }

  private _processTasks(tasks: ITask[]) {
    const now = new Date();

    this.pendingTasksCount = tasks.filter(t => 
        new Date(t.startDate) >= startOfDay(now) 
    ).length;

    this.todayTasks = tasks
        .filter(t => isSameDay(new Date(t.startDate), now))
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .map(t => ({
            title: t.title,
            taskType: t.taskType,
            startDate: t.startDate,
            endDate: t.endDate,
            description: t.description,
            subjectCode: t.subjectCode
        }));
  }

  private _processPeriods(periods: IPeriod[], allSubjects: ITableRow[]) {
    if (!periods || periods.length === 0) return;

    const currentPeriod = periods[periods.length - 1];
  const enrolledList = currentPeriod.subjects || [];

    this.currentSubjects = enrolledList.map(enrolled => {
        const match = allSubjects.find(s => s.id === enrolled.subjectCode);

        return {
            ...enrolled,
            displayName: match ? match.name : enrolled.subjectCode
        };
    });
  }

  calcAbsencePercentage(absences: number | undefined): number {
      const max = 60; 
      const val = absences || 0;
      return Math.min((val / max) * 100, 100);
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