import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { ITask, ITaskRequest } from '../../../core/models/entitys/ITaskRequest.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private _http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/tasks`;

  createTask(payload: ITaskRequest): Observable<any> {
    return this._http.post<any>(this.API_URL, payload);
  }

  getTasksByMonth(month: number, year: number): Observable<ITask[]> {
    return this._http.get<ITask[]>(`${this.API_URL}/month?month=${month}&year=${year}`);
  }
}