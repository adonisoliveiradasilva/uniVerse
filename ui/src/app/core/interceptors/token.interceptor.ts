import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core'; 
import { AuthService } from '../../services/api/auth-service/auth-service';
import { environment } from '../../environment/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../../services/rxjs/alert-service/alert-service';

export const TokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {

  const authService = inject(AuthService); 
  const alertService = inject(AlertService);
  const token = authService.getToken();
  const isApiRequest = req.url.startsWith(environment.apiUrl);

  let requestToHandle = req

  if (token && isApiRequest) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(requestToHandle).pipe(
    catchError((error: HttpEvent<any>) => {
      
      if (error instanceof HttpErrorResponse) {
        
        if (error.status === 401) {
          alertService.error('Sua sessão expirou. Por favor, logue-se novamente.');
          authService.logout();
        }
      }
      return throwError(() => error);
    })
  );;
};