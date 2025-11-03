import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { IApiSingleResponse } from '../../../core/models/api-response.model';
import { AlertService } from '../../rxjs/alert-service/alert-service';
import { environment } from '../../../environment/environment';
import { IStudent } from '../../../core/models/entitys/IStudent.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private _http = inject(HttpClient);
  private _alertService = inject(AlertService);

  public createStudent(student: Pick<IStudent, 'email' | 'name'>): Observable<IStudent> {
    const url = `${environment.apiUrl}/students`; // Endpoint de criação
    return this._http.post<IApiSingleResponse<IStudent>>(url, student).pipe(
      map(response => response.data),
      catchError(error => {
        const msg = error?.error?.message || 'Falha ao criar usuário.';
        this._alertService.error(msg);
        return throwError(() => error);
      })
    );
  }

  public sendEmailForgotPassword(email: string): Observable<any> {
    const url = `${environment.apiUrl}/auth/request-password-reset`;
    const payload = { email: email };

    return this._http.post(url, payload).pipe(
      catchError(error => {
        const msg = error?.error?.message || 'Falha ao solicitar redefinição de senha.';
        this._alertService.error(msg);
        return throwError(() => error);
      })
    );
  }

  public setPassword(token: string, newPassword: string): Observable<any> {
    const url = `${environment.apiUrl}/auth/set-password`; 
    
    const payload = {
      token: token,
      newPassword: newPassword
    };

    return this._http.post(url, payload).pipe(
      catchError(error => {
        const msg = error?.error?.message || 'Falha ao definir senha. O link pode ter expirado.';
        this._alertService.error(msg);
        return throwError(() => error);
      })
    );
  }
}

