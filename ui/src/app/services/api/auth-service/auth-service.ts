import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserData, LoginResponse, ApiResponse } from '../../../core/models/auth.model';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _http = inject(HttpClient);
  private _router = inject(Router);
  private _currentUserSubject = new BehaviorSubject<UserData | null>(null);

  public currentUser$ = this._currentUserSubject.asObservable();
  
  private _authApiUrl = `${environment.apiUrl}/auth`;  

  public initUser(): void {
    this._loadInitialUser();
  }

  private _loadInitialUser(): void {
    const userDataString = localStorage.getItem('currentUser');
    if (userDataString) {
      const user = JSON.parse(userDataString) as UserData;
      this._currentUserSubject.next(user);
    }
  }

  public login(email: string, password: string): Observable<ApiResponse<LoginResponse>> {
    return this._http.post<ApiResponse<LoginResponse>>(`${this._authApiUrl}/login`, { email, password }).pipe(
      tap(response => {
        const { token, user } = response.data;

        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(user));

        this._currentUserSubject.next(user);
        
        this._router.navigate(['/dashboard']); 
      })
    );
  }

  public logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');

    this._currentUserSubject.next(null);

    this._router.navigate(['/login']);
  }

  public getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }
  
  public getCurrentUser(): UserData | null {
    return this._currentUserSubject.value;
  }
}