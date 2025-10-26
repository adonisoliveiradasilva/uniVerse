import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { IApiResponse, IApiSingleResponse } from '../../../core/models/api-response.model';
import { ITableRow } from '../../../core/models/table.model';
import { AlertService } from '../../rxjs/alert-service/alert-service';
import { environment } from '../../../environment/environment';
import { ISubject } from '../../../core/models/entitys/ISubject.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private _http = inject(HttpClient);
  private _alertService = inject(AlertService);

  private _institutionAcronym = 'UFOP';

  private _subjects$ = new BehaviorSubject<ITableRow[]>([]);

  public getSubjects(): Observable<ITableRow[]> {
    this.fetchSubjects().subscribe();
    return this._subjects$.asObservable();
  }

  public fetchSubjects(): Observable<ITableRow[]> {
    const url = `${environment.apiUrl}/institutions/${this._institutionAcronym}/subjects`;
    return this._http.get<IApiResponse<ISubject>>(url).pipe(
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
        const msg = error?.error?.message || 'Falha ao buscar disciplinas.';
        this._alertService.error(msg);
        return throwError(() => error);
      })
    );
  }

  public getSubjectByCode(institutionAcronym: string, code: string): Observable<ISubject> {
    const url = `${environment.apiUrl}/institutions/${institutionAcronym}/subjects/${code}`;
    return this._http.get<IApiSingleResponse<ISubject>>(url).pipe(
      map(response => response.data),
      catchError(error => {
        const msg = error?.error?.message || `Falha ao carregar disciplina ${code}.`;
        this._alertService.error(msg);
        return throwError(() => error);
      })
    );
  }

  public createSubject(subject: Pick<ISubject, 'code' | 'name' | 'hours'>): Observable<ISubject> {
    const url = `${environment.apiUrl}/institutions/${this._institutionAcronym}/subjects`;
    return this._http.post<IApiSingleResponse<ISubject>>(url, subject).pipe(
      map(response => response.data),
      tap(newSubject => {
        this._alertService.success(`Disciplina "${newSubject.name}" criada com sucesso!`);
        this.fetchSubjects().subscribe();
      }),
      catchError(error => {
        const msg = error?.error?.message || 'Falha ao criar disciplina.';
        this._alertService.error(msg);
        return throwError(() => error);
      })
    );
  }

  public updateSubject(subject: Pick<ISubject, 'code' | 'name' | 'hours'>): Observable<ISubject> {
    const url = `${environment.apiUrl}/institutions/${this._institutionAcronym}/subjects/${subject.code}`;
    return this._http.put<IApiSingleResponse<ISubject>>(url, subject).pipe(
      map(response => response.data),
      tap(updated => {
        this._alertService.success(`Disciplina "${updated.name}" atualizada com sucesso!`);
        this.fetchSubjects().subscribe();
      }),
      catchError(error => {
        const msg = error?.error?.message || 'Falha ao atualizar disciplina.';
        this._alertService.error(msg);
        return throwError(() => error);
      })
    );
  }

  public deleteSubject(code: string): Observable<ISubject> {
    const url = `${environment.apiUrl}/institutions/${this._institutionAcronym}/subjects/${code}`;
    return this._http.delete<IApiSingleResponse<ISubject>>(url).pipe(
      map(response => response.data),
      tap(deleted => {
        this._alertService.success(`Disciplina "${deleted.name}" deletada com sucesso!`);
        this.fetchSubjects().subscribe();
      }),
      catchError(error => {
        const msg = error?.error?.message || `Falha ao deletar disciplina ${code}.`;
        this._alertService.error(msg);
        return throwError(() => error);
      })
    );
  }
}
