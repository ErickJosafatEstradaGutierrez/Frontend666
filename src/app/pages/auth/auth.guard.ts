// \src\app\pages\auth\auth.guard.ts
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const requiredPermiso = route.data['requiredPermiso'];
  if (requiredPermiso && !tokenService.hasPermiso(requiredPermiso)) {
    console.warn(`Acceso denegado: falta el permiso '${requiredPermiso}'`);
    router.navigate(['/dashboard']); // O a una página de acceso denegado
    return false;
  }

  return true;
};
