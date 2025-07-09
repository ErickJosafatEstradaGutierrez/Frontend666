// token.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly PERMISOS_KEY = 'permisos';

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  setPermisos(permisos: string[]): void {
    localStorage.setItem(this.PERMISOS_KEY, JSON.stringify(permisos));
  }

  getPermisos(): string[] {
    const permisos = localStorage.getItem(this.PERMISOS_KEY);
    return permisos ? JSON.parse(permisos) : [];
  }

  hasPermiso(nombrePermiso: string): boolean {
    return this.getPermisos().includes(nombrePermiso);
  }
}