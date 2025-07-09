//app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { authGuard } from './pages/auth/auth.guard';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ExpedienteComponent } from './pages/expediente/expediente.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard] // ¡Protegido por el guard!
  },
  {
    path: 'expedientes',
    component: ExpedienteComponent,
    canActivate: [authGuard],
  }
];
