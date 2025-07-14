// \src\app\pages\dashboard\dashboard.component.ts
import { Component } from '@angular/core';
import { TokenService } from '../services/token.service';
import {ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ExpedienteComponent } from '../expediente/expediente.component';
import { ConsultaComponent } from '../consultas/consultas.component';
import { RecetasComponent } from '../recetas/recetas.component';
import { HorarioComponent } from '../horarios/horarios.component';
import { ConsultoriosComponent } from '../consultorio/consultorio.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    MessageModule,
    MessagesModule,
    ExpedienteComponent,
    ConsultaComponent,
    RecetasComponent,
    HorarioComponent,
    ConsultoriosComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  mostrarExpediente = false;
  mostrarConsulta = false;
  mostrarReceta = false;
  mostrarHorario = false;
  mostrarConsultorios = false;

  selectedModule: 'expediente' | 'consulta' | 'receta' | 'horario' | 'consultorios' | null = null;

  toggleModule(module: 'expediente' | 'consulta' | 'receta' | 'horario' | 'consultorios') {
    if (this.selectedModule === module) {
      this.selectedModule = null; // Ocultar si se vuelve a presionar el mismo
    } else {
      this.selectedModule = module; // Mostrar el nuevo y ocultar otros
    }
  }

  constructor(private tokenService: TokenService, private http: HttpClient, private router: Router) {}

  puedeCrearExpediente(): boolean {
    return this.tokenService.hasPermiso('add_expediente');
  }

  puedeCrearConsulta(): boolean {
    return this.tokenService.hasPermiso('add_consulta');
  }

  puedeCrearReceta(): boolean {
    return this.tokenService.hasPermiso('add_receta');
  }

  puedeCrearHorario(): boolean {
    return this.tokenService.hasPermiso('add_horario');
  }

  puedeCrearConsultorios(): boolean {
    return this.tokenService.hasPermiso('add_consultorio');
  }

  puedeLeerExpediente(): boolean {
    return this.tokenService.hasPermiso('read_expediente');
  }

  puedeLeerConsulta(): boolean {
    return this.tokenService.hasPermiso('read_consulta');
  }

  puedeLeerReceta(): boolean {
    return this.tokenService.hasPermiso('read_receta');
  }

  puedeLeerHorario(): boolean {
    return this.tokenService.hasPermiso('read_horario');
  }

  puedeLeerConsultorios(): boolean {
    return this.tokenService.hasPermiso('read_consultorio');
  }

  puedeActualizarExpediente(): boolean {
    return this.tokenService.hasPermiso('update_expediente');
  }

  puedeActualizarConsulta(): boolean {
    return this.tokenService.hasPermiso('update_consulta');
  }

  puedeActualizaReceta(): boolean {
    return this.tokenService.hasPermiso('update_receta');
  }

  puedeActualizaHorario(): boolean {
    return this.tokenService.hasPermiso('update_horario');
  }

  puedeActualizaConsultorios(): boolean {
    return this.tokenService.hasPermiso('update_consultorio');
  }

  puedeEliminarExpediente(): boolean {
    return this.tokenService.hasPermiso('delete_expediente');
  }

  puedeEliminarConsulta(): boolean {
    return this.tokenService.hasPermiso('delete_consulta');
  }

  puedeEliminarReceta(): boolean {
    return this.tokenService.hasPermiso('delete_receta');
  }

  puedeEliminarHorario(): boolean {
    return this.tokenService.hasPermiso('delete_horario');
  }

  puedeEliminarConsultorios(): boolean {
    return this.tokenService.hasPermiso('delete_consultorio');
  }

  // Métodos para mostrar secciones
  toggleExpediente() {
    this.mostrarExpediente = !this.mostrarExpediente;
  }

  toggleConsulta() {
    this.mostrarConsulta = !this.mostrarConsulta;
  }

  toggleReceta() {
    this.mostrarReceta = !this.mostrarReceta;
  }
  
  toggleHorario() {
    this.mostrarHorario = !this.mostrarHorario;
  }

  toggleConsultorios() {
    this.mostrarConsultorios = !this.mostrarConsultorios;
  }

  get isPaciente(): boolean {
    return this.tokenService.isPaciente();
  }

  get expedienteButtonText(): string {
    return this.isPaciente ? 'Expediente' : 'Expedientes';
  }

  get recargarButtonText(): string {
    return this.isPaciente ? 'Recargar Expediente' : 'Recargar Expedientes';
  }

  logout(): void {
    const token = this.tokenService.getToken(); // asegúrate que este método exista

    this.http.post('http://127.0.0.1:6543/api/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: () => {
        this.tokenService.clearToken(); // Limpia token del localStorage
        this.router.navigate(['/login']); // Redirige al login
      },
      error: (err) => {
        console.error('Error al cerrar sesión', err);
        this.tokenService.clearToken();
        this.router.navigate(['/login']);
      }
    });
  }


}