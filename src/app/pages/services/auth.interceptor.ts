// \src\app\pages\services\auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from '../services/token.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();
  
  console.log('Interceptor - Token encontrado:', token);

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token.trim()}`),
    });
    return next(cloned);
  }

  return next(req);
};