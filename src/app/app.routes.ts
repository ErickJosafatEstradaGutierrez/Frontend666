// \src\app\app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { authGuard } from './pages/auth/auth.guard';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ExpedienteComponent } from './pages/expediente/expediente.component';
import { CreateExpComponent } from './pages/expediente/create/create.component';
import { UpdateExpComponent } from './pages/expediente/update/update.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'expedientes',
    component: ExpedienteComponent,
    canActivate: [authGuard],
    children: [
      { 
        path: 'create', 
        component: CreateExpComponent,
        canActivate: [authGuard],
        data: { requiredPermiso: 'add_expediente' }
      },
      { 
        path: 'update/:id', 
        component: UpdateExpComponent,
        canActivate: [authGuard],
        data: { requiredPermiso: 'update_expediente' }
      }
    ]
  }
];
