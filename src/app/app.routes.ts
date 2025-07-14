// \src\app\app.routes.ts
import { Routes, Router } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { authGuard } from './pages/auth/auth.guard';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ExpedienteComponent } from './pages/expediente/expediente.component';
//import { CreateExpComponent } from './pages/expediente/create/create.component';
//import { UpdateExpComponent } from './pages/expediente/update/update.component';
import { TokenService } from './pages/services/token.service';
import { inject } from '@angular/core';




export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [() => !inject(TokenService).isAuthenticated() ? true : inject(Router).createUrlTree(['/dashboard'])]
  },
  { 
    path: 'register', 
    component: RegisterComponent,
    canActivate: [() => !inject(TokenService).isAuthenticated() ? true : inject(Router).createUrlTree(['/dashboard'])]
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard] // Protegida por authGuard
  },
  {
    path: 'expedientes',
    component: ExpedienteComponent,
    canActivate: [authGuard],
    //children: [
    //  { 
    //    path: 'create', 
    //    component: CreateExpComponent,
    //    data: { requiredPermiso: 'add_expediente' } // No necesita repetir canActivate
    //  },
    //  { 
    //    path: 'update/:id', 
    //    component: UpdateExpComponent,
    //    data: { requiredPermiso: 'update_expediente' }
    //  }
    // ]
  },
  { path: '**', redirectTo: 'login' } // Manejo de rutas no encontradas
];
