import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { IApiResponse, IApiSingleResponse } from '../../../core/models/api-response.model';
import { ITableRow } from '../../../core/models/table.model';
import { IInstitution } from '../../../core/models/entitys/IInstitution.model';

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {
  private _http = inject(HttpClient);
  
  private _apiUrl = 'http://localhost:8080/api/institutions';

  public getInstitutions(): Observable<ITableRow[]> {
    return this._http.get<IApiResponse<ITableRow>>(this._apiUrl).pipe(
      map(response => response.data),
      
      tap(data => console.log('Instituições carregadas:', data)) 
    );
  }

  public createInstitution(institution: Pick<IInstitution, 'name' | 'acronym'>): Observable<IInstitution> {
    return this._http.post<IApiSingleResponse<IInstitution>>(this._apiUrl, institution).pipe(map(response => response.data));
  }
}
