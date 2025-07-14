// \src\app\pages\services\token.service.ts
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'access_token';
  //private readonly PERMISOS_KEY = 'permisos';
  public  readonly REFRESH_TOKEN_KEY = 'refresh_token';

  private decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Obtener datos del usuario desde el token
  getTokenData(): { id_usuario?: number, nombre?: string, rol?: string, permisos?: string[] } {
    const token = this.getToken();
    if (!token) return {};
    return this.decodeToken(token) || {};
  }
  hasPermiso(nombrePermiso: string): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.permisos) return false;
    
    return decoded.permisos.includes(nombrePermiso);
  }

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
  if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
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
      localStorage.setItem(this.REFRESH_TOKEN_KEY, JSON.stringify(permisos));
    }
  }

  getPermisos(): string[] {
    if (typeof window !== 'undefined') {
      const permisos = localStorage.getItem(this.REFRESH_TOKEN_KEY);
      return permisos ? JSON.parse(permisos) : [];
    }
    return [];
  }
  
  // En token.service.ts
  getRol(): string | undefined {
    const token = this.getToken();
    if (!token) return undefined;
    
    const decoded = this.decodeToken(token);
    return decoded?.rol;
  }

  isPaciente(): boolean {
    return this.getRol() === 'paciente';
  }

}