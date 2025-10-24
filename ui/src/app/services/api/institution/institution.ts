import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError, delay } from 'rxjs';
import { IApiResponse, IApiSingleResponse } from '../../../core/models/api-response.model';
import { ITableRow } from '../../../core/models/table.model';
import { IInstitution } from '../../../core/models/entitys/IInstitution.model';
import { AlertService } from '../../rxjs/alert/alert';

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {
  private _http = inject(HttpClient);
  private _apiUrl = 'http://localhost:8080/api/institutions';
  private _alertService = inject(AlertService);

  private _institutions$ = new BehaviorSubject<ITableRow[]>([]);

  public getInstitutions(): Observable<ITableRow[]> {
    this.fetchInstitutions().subscribe();
    return this._institutions$.asObservable();
  }

  public fetchInstitutions(): Observable<ITableRow[]> {
    return this._http.get<IApiResponse<IInstitution>>(this._apiUrl).pipe(
      map(response =>  response.data.map(item => ({
          id: item.acronym,
          name: item.name
        }))),
      tap(data => {
        this._institutions$.next(data);
      })
    );
  }

  public getInstitutionByAcronym(acronym: string): Observable<IInstitution> {
    return this._http.get<IApiSingleResponse<IInstitution>>(`${this._apiUrl}/${acronym}`).pipe(
      map(response => response.data),
      catchError(error => {
        const errorMessage = error?.error?.message || `Falha ao carregar instituição ${acronym}.`;
        this._alertService.error(errorMessage);
        return throwError(() => error);
      })
    );
  }

  public createInstitution(institution: Pick<IInstitution, 'name' | 'acronym'>): Observable<IInstitution> {
    return this._http.post<IApiSingleResponse<IInstitution>>(this._apiUrl, institution).pipe(
      map(response => response.data),
      
      tap(novaInstituicao => {
        this._alertService.success(`Instituição "${novaInstituicao.name}" criada com sucesso!`);
        this.fetchInstitutions().subscribe();
      }),
      
      catchError(error => {
        const errorMessage = error?.error?.message || 'Falha ao criar instituição.';
        this._alertService.error(errorMessage);
        
        return throwError(() => error); 
      })
    );
  }

  public updateInstitution(institution: Pick<IInstitution, 'name' | 'acronym'>): Observable<IInstitution> {
    return this._http.put<IApiSingleResponse<IInstitution>>(`${this._apiUrl}/${institution.acronym}`, institution).pipe(
      map(response => response.data),
      tap(updatedInstituicao => {
        this._alertService.success(`Instituição "${updatedInstituicao.name}" atualizada com sucesso!`);
        this.fetchInstitutions().subscribe();
      }),
      catchError(error => {
        let errorMessage = 'Falha ao atualizar instituição.';
        if (error.status === 400) {
          errorMessage = error.error?.message || 'Dados inválidos.';
        }
        this._alertService.error(errorMessage);
        return throwError(() => error);
      })
    );
  }

  public deleteInstitution(acronym: string): Observable<IInstitution> {
    return this._http.delete<IApiSingleResponse<IInstitution>>(`${this._apiUrl}/${acronym}`).pipe(
      map(response => response.data),
      tap(deletedInstitution => {
        this._alertService.success(`Instituição "${deletedInstitution.name}" deletada com sucesso!`);
        this.fetchInstitutions().subscribe();
      }),
      catchError(error => {
        const errorMessage = error?.error?.message || `Falha ao deletar instituição ${acronym}.`;
        this._alertService.error(errorMessage);
        return throwError(() => error);
      })
    );
  }
}
