import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { IApiResponse, IApiSingleResponse } from '../../../core/models/api-response.model';
import { ITableRow } from '../../../core/models/table.model';
import { AlertService } from '../../rxjs/alert-service/alert-service';
import { environment } from '../../../environment/environment';
import { ICourse } from '../../../core/models/entitys/ICourse.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private _http = inject(HttpClient);
  private _alertService = inject(AlertService);

  private _institutionAcronym = 'UFOP';

  private _subjects$ = new BehaviorSubject<ITableRow[]>([]);

  public getCourses(): Observable<ITableRow[]> {
    this.fetchCourses().subscribe();
    return this._subjects$.asObservable();
  }

  public fetchCourses(): Observable<ITableRow[]> {
    const url = `${environment.apiUrl}/institutions/${this._institutionAcronym}/courses`;
    return this._http.get<IApiResponse<ICourse>>(url).pipe(
      map(response =>
        response.data.map(item => ({
          id: item.code,
          name: item.name
        }))
      ),
      tap(data => {
        this._subjects$.next(data);
      }),
      catchError(error => {
        const msg = error?.error?.message || 'Falha ao buscar cursos.';
        this._alertService.error(msg);
        return throwError(() => error);
      })
    );
  }

  public getCourseByCode(institutionAcronym: string, code: string): Observable<ICourse> {
    const url = `${environment.apiUrl}/institutions/${institutionAcronym}/courses/${code}`;
    return this._http.get<IApiSingleResponse<ICourse>>(url).pipe(
      map(response => response.data),
      catchError(error => {
        const msg = error?.error?.message || `Falha ao carregar curso ${code}.`;
        this._alertService.error(msg);
        return throwError(() => error);
      })
    );
  }

  public createCourse(course: Pick<ICourse, 'code' | 'name' | 'periodsQuantity' |'description' | 'subjectsIds'>): Observable<ICourse> {
    const url = `${environment.apiUrl}/institutions/${this._institutionAcronym}/courses`;
    return this._http.post<IApiSingleResponse<ICourse>>(url, course).pipe(
      map(response => response.data),
      tap(newCourse => {
        this._alertService.success(`Curso "${newCourse.name}" criado com sucesso!`);
        this.fetchCourses().subscribe();
      }),
      catchError(error => {
        const msg = error?.error?.message || 'Falha ao criar curso.';
        this._alertService.error(msg);
        return throwError(() => error);
      })
    );
  }

  public updateCourse(course: Pick<ICourse, 'code' | 'name' | 'periodsQuantity' |'description' | 'subjectsIds'>): Observable<ICourse> {
    const url = `${environment.apiUrl}/institutions/${this._institutionAcronym}/courses/${course.code}`;
    return this._http.put<IApiSingleResponse<ICourse>>(url, course).pipe(
      map(response => response.data),
      tap(updated => {
        this._alertService.success(`Curso "${updated.name}" atualizado com sucesso!`);
        this.fetchCourses().subscribe();
      }),
      catchError(error => {
        const msg = error?.error?.message || 'Falha ao atualizar curso.';
        this._alertService.error(msg);
        return throwError(() => error);
      })
    );
  }

  public deleteCourse(code: string): Observable<ICourse> {
    const url = `${environment.apiUrl}/institutions/${this._institutionAcronym}/courses/${code}`;
    return this._http.delete<IApiSingleResponse<ICourse>>(url).pipe(
      map(response => response.data),
      tap(deleted => {
        this._alertService.success(`Curso "${deleted.name}" deletado com sucesso!`);
        this.fetchCourses().subscribe();
      }),
      catchError(error => {
        const msg = error?.error?.message || `Falha ao deletar curso ${code}.`;
        this._alertService.error(msg);
        return throwError(() => error);
      })
    );
  }
}
