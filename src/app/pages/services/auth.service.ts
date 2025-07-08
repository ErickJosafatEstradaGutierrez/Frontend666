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
      this.tokenService.setToken(response.access_token);
      this.router.navigate(['/dashboard']); // Redirige al dashboard
    })
  );
}
  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

}
