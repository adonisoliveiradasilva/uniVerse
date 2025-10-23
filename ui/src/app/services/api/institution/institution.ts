import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { IApiResponse } from '../../../core/models/api-response.model';
import { ITableRow } from '../../../core/models/table.model';

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
}
