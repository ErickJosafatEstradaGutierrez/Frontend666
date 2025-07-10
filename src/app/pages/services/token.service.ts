// \src\app\pages\services\token.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly PERMISOS_KEY = 'permisos';

  // Almacenar token correctamente
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  // Recuperar token
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(this.TOKEN_KEY);
      return token;
    }
    return null;
  }

  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.PERMISOS_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Verificar expiración si es un JWT
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && payload.exp < Date.now() / 1000) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  setPermisos(permisos: string[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.PERMISOS_KEY, JSON.stringify(permisos));
    }
  }

  getPermisos(): string[] {
    if (typeof window !== 'undefined') {
      const permisos = localStorage.getItem(this.PERMISOS_KEY);
      return permisos ? JSON.parse(permisos) : [];
    }
    return [];
  }

  hasPermiso(nombrePermiso: string): boolean {
    return this.getPermisos().includes(nombrePermiso);
  }
}