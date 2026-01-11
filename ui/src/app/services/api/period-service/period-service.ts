import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import { IApiResponse, IApiSingleResponse } from '../../../core/models/api-response.model';
import { AlertService } from '../../rxjs/alert-service/alert-service';
import { environment } from '../../../environment/environment';
import { IPeriod, IEnrolledSubject, IEnrolledSubjectRequest } from '../../../core/models/entitys/IPeriod.model';
import { ISubject } from '../../../core/models/entitys/ISubject.model';
import { ITableRow } from '../../../core/models/table.model';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {
  private _http = inject(HttpClient);
  private _alertService = inject(AlertService);

  private _periodsApiUrl = `${environment.apiUrl}/periods`;
  private _subjectsApiUrl = `${environment.apiUrl}/subjects`;
  private _periods$ = new BehaviorSubject<IPeriod[]>([]);
  public periods$ = this._periods$.asObservable();

  private _currentPeriodSubjects$ = new BehaviorSubject<IEnrolledSubject[]>([]);
  public currentPeriodSubjects$ = this._currentPeriodSubjects$.asObservable();
  private _currentPeriodId$ = new BehaviorSubject<number | null>(null);
  public currentPeriodId$ = this._currentPeriodId$.asObservable();

  constructor() {
    this.fetchAllPeriods().subscribe(periods => {
      if (periods && periods.length > 0) {
        this.fetchSubjectsForPeriod(periods[0].id).subscribe();
      }
    });
  }

  public getCurrentPeriodId(): number | null {
    return this._currentPeriodId$.value;
  }

  public getCurrentPeriodSubjects(): IEnrolledSubject[] {
    return this._currentPeriodSubjects$.value;
  }

  public fetchAllPeriods(): Observable<IPeriod[]> {
    return this._http.get<IApiResponse<IPeriod>>(this._periodsApiUrl).pipe(
      map(response => response.data),
      tap(periods => this._periods$.next(periods)),
      catchError(error => {
        const msg = error?.error?.message || 'Falha ao buscar períodos.';
        this._alertService.error(msg);
        return throwError(() => error);
      })
    );
  }

  public createPeriod(subjectCodes: string[] = []): Observable<IPeriod> {
    const payload = { subjectCodes: subjectCodes };
    return this._http.post<IApiSingleResponse<IPeriod>>(this._periodsApiUrl, payload).pipe(
      map(response => response.data),
      tap(newPeriod => {
        this._alertService.success(`Período criado com sucesso!`);
        this.fetchAllPeriods().subscribe();
      }),
      catchError(error => {
        const msg = error?.error?.message || 'Falha ao criar período.';
        this._alertService.error(msg);
        return throwError(() => error);
      })
    );
  }

  public deletePeriod(periodId: number): Observable<IPeriod[]> {
    const url = `${this._periodsApiUrl}/${periodId}`;
    
    return this._http.delete<void>(url).pipe(
      switchMap(() => {
        this._alertService.success(`Período deletado com sucesso!`);
        return this.fetchAllPeriods();
      }),
      catchError(error => {
        const msg = error?.error?.message || `Falha ao deletar período ${periodId}.`;
        this._alertService.error(msg);
        return throwError(() => error);
      })
    );
  }

  public fetchSubjectsForPeriod(periodId: number): Observable<IEnrolledSubject[]> {
    const url = `${this._periodsApiUrl}/${periodId}`;
    
    this._currentPeriodId$.next(periodId);

    return this._http.get<IApiSingleResponse<IPeriod>>(url).pipe(
      map(response => response.data.subjects || []),
      tap(enrolledSubjects => {
        this._currentPeriodSubjects$.next(enrolledSubjects);
      }),
      catchError(error => {
        const msg = error?.error?.message || `Falha ao buscar disciplinas do período ${periodId}.`;
        this._alertService.error(msg);
        this._currentPeriodSubjects$.next([]);
        return throwError(() => error);
      })
    );
  }

  public updateEnrolledSubjectDetails(periodId: number, subjectCode: string, data: IEnrolledSubjectRequest): Observable<IEnrolledSubject> {
    const url = `${this._periodsApiUrl}/${periodId}/subjects/${subjectCode}`;
    return this._http.put<IApiSingleResponse<IEnrolledSubject>>(url, data).pipe(
      map(response => response.data),
      tap(updatedSubject => {
        this._alertService.success(`Disciplina "${updatedSubject.subjectCode}" atualizada!`);
        this.fetchSubjectsForPeriod(periodId).subscribe();
      }),
      catchError(error => {
        const msg = error?.error?.message || `Falha ao atualizar disciplina ${subjectCode}.`;
        this._alertService.error(msg);
        return throwError(() => error);
      })
    );
  }

  public getAvailableSubjects(): Observable<ISubject[]> {
    const url = `${this._subjectsApiUrl}/available`;
    return this._http.get<IApiResponse<ISubject>>(url).pipe(
      map(response => response.data),
      catchError(error => {
        const msg = error?.error?.message || 'Falha ao buscar disciplinas disponíveis.';
        this._alertService.error(msg);
        return throwError(() => error);
      })
    );
  }

  public getCurrentPeriodsValue(): IPeriod[] {
    return this._periods$.value;
  
  }

  public updatePeriodSubjectsList(periodId: number, subjects: any[]): Observable<IPeriod> {
    const url = `${this._periodsApiUrl}/${periodId}`;
    const payload = { subjects: subjects };    
    
    return this._http.put<IApiSingleResponse<IPeriod>>(url, payload).pipe(
      map(response => response.data),
      tap(updatedPeriod => {
        this._alertService.success(`Período ${updatedPeriod.id} atualizado.`);
        this.fetchSubjectsForPeriod(periodId).subscribe();
      }),
      catchError(error => {
        const msg = error?.error?.message || `Falha ao atualizar disciplinas do período ${periodId}.`;
        this._alertService.error(msg);
        return throwError(() => error);
      })
    );
  }

  public getGlobalAverage(): Observable<number> {
    const url = `${this._periodsApiUrl}/stats/global-average`;
    
    return this._http.get(url, { responseType: 'text' }).pipe(
      map(response => {
        const num = parseFloat(response);
        return isNaN(num) ? 0 : num;
      }),
      catchError(error => {
        console.error('Erro ao buscar média global', error);
        return of(0); 
      })
    );
  }
}