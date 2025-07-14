// \src\app\pages\auth\auth.guard.ts
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Si no está autenticado, redirige a login
  if (!tokenService.isAuthenticated()) {
    tokenService.clearToken();
    return router.createUrlTree(['/login']);
  }

  // Verificación de permisos
  const requiredPermiso = route.data['requiredPermiso'];
  if (requiredPermiso && !tokenService.hasPermiso(requiredPermiso)) {
    console.warn(`Acceso denegado: falta el permiso '${requiredPermiso}'`);
    return router.navigate(['/dashboard'], {
      state: { error: `Falta el permiso: ${requiredPermiso}` }
    });
  }

  return true;
};