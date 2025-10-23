import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
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
    return this._http.get<IApiResponse<ITableRow>>(this._apiUrl).pipe(
      map(response => response.data),
      tap(data => {
        this._institutions$.next(data);
        console.log('Instituições carregadas:', data);
      })
    );
  }

  public createInstitution(institution: Pick<IInstitution, 'name' | 'acronym'>): Observable<IInstitution> {
    return this._http.post<IApiSingleResponse<IInstitution>>(this._apiUrl, institution).pipe(
      map(response => response.data),
      
      tap(novaInstituicao => {
        this._alertService.success(`Instituição "${novaInstituicao.name}" criada com sucesso!`);
        this.fetchInstitutions().subscribe(); // Recarrega a lista
      }),
      
      catchError(error => {
        const errorMessage = error?.error?.message || 'Falha ao criar instituição.';
        this._alertService.error(errorMessage);
        
        return throwError(() => error); 
      })
    );
  }
}
