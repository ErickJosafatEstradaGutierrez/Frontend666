// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export interface LoginData {
  correo: string;
  password: string;
  codigo_totp: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:6543'; // URL de Go

    constructor(
        private http: HttpClient,
        private router: Router,  // Inyecta Router
        private tokenService: TokenService  // Inyecta TokenService
    ) {}

  login(data: LoginData): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((response: any) => {
        console.log('Respuesta completa del login:', response);

        // Verificar si la respuesta tiene la estructura esperada
        if (response.Data && response.Data[0]) {
          const authData = response.Data[0];
          
          this.tokenService.setToken(authData.access_token);
          localStorage.setItem('refresh_token', authData.refresh_token);
          this.tokenService.setPermisos(authData.permisos || []);
          
          console.log('Token establecido:', authData.access_token);
          console.log('Permisos establecidos:', authData.permisos);
          
          this.router.navigate(['/dashboard']);
        } else {
          console.error('Estructura de respuesta inesperada:', response);
        }
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

}
