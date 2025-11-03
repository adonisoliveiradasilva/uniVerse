import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core'; // 1. Importe o inject
import { Observable } from 'rxjs';
import { AuthService } from '../../services/api/auth-service/auth-service'; // Use o caminho correto para seu AuthService
import { environment } from '../../environment/environment';

// É apenas uma função, não uma classe
export const TokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {

  // 2. Injete o serviço usando inject()
  const authService = inject(AuthService); 
  
  const token = authService.getToken();
  const isApiRequest = req.url.startsWith(environment.apiUrl);

  if (token && isApiRequest) {
    // 3. Clone a requisição (req) que veio como parâmetro
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // 4. Passe a requisição clonada
    return next(clonedReq);
  }

  // 5. Se não tiver token, passe a requisição original
  return next(req);
};