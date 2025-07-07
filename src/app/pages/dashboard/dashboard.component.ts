import { Component } from '@angular/core';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <h1>Bienvenido al Dashboard</h1>
    <button (click)="logout()">Cerrar sesión</button>
  `,
})
export class DashboardComponent {
  constructor(private tokenService: TokenService) {}

  logout(): void {
    this.tokenService.removeToken();
    window.location.href = '/login'; // O usa Router para navegación
  }
}