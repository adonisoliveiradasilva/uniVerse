import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserData, LoginResponse, ApiResponse } from '../../../core/models/auth.model';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<UserData | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  
  private authApiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadInitialUser();
  }

  private loadInitialUser(): void {
    const userDataString = localStorage.getItem('currentUser');
    if (userDataString) {
      const user = JSON.parse(userDataString) as UserData;
      this.currentUserSubject.next(user);
    }
  }

  public login(email: string, password: string): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.authApiUrl}/login`, { email, password }).pipe(
      tap(response => {
        const { token, user } = response.data;

        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(user));

        this.currentUserSubject.next(user);

        this.router.navigate(['/dashboard']); 
      })
    );
  }

  public logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');

    this.currentUserSubject.next(null);

    this.router.navigate(['/login']);
  }

  public getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }
  
  public getCurrentUser(): UserData | null {
    return this.currentUserSubject.value;
  }
}