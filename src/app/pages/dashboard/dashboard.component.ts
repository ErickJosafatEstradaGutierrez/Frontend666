// \src\app\pages\dashboard\dashboard.component.ts
import { Component } from '@angular/core';
import { TokenService } from '../services/token.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../pages/services/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ExpedienteComponent } from '../expediente/expediente.component';
//import { ConsultoriosComponent } from '../consultorio/consultorio.component';
import { ConsultaComponent } from '../consultas/consultas.component';
import { RecetasComponent } from '../recetas/recetas.component';

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
    RecetasComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(private tokenService: TokenService) {}

  puedeCrearExpediente(): boolean {
    return this.tokenService.hasPermiso('add_expediente');
  }

  puedeCrearConsulta(): boolean {
    return this.tokenService.hasPermiso('add_consulta');
  }

  puedeCrearReceta(): boolean {
    return this.tokenService.hasPermiso('add_receta');
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

  puedeActualizarExpediente(): boolean {
    return this.tokenService.hasPermiso('update_expediente');
  }

  puedeActualizarConsulta(): boolean {
    return this.tokenService.hasPermiso('update_consulta');
  }

  puedeActualizaReceta(): boolean {
    return this.tokenService.hasPermiso('update_receta');
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
}