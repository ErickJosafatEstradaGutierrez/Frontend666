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
    ExpedienteComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(private tokenService: TokenService) {}

  puedeCrearExpediente(): boolean {
    return this.tokenService.hasPermiso('add_expediente');
  }

  puedeLeerExpediente(): boolean {
    return this.tokenService.hasPermiso('read_expediente');
  }

  puedeActualizarExpediente(): boolean {
    return this.tokenService.hasPermiso('update_expediente');
  }

  puedeEliminarExpediente(): boolean {
    return this.tokenService.hasPermiso('delete_expediente');
  }

  // Action methods
  crearExpediente() {
    // Implement your create logic here
    console.log('Crear expediente clicked');
  }

  verExpedientes() {
    // Implement your view logic here
    console.log('Ver expedientes clicked');
  }

  editarExpediente() {
    // Implement your edit logic here
    console.log('Editar expediente clicked');
  }

  eliminarExpediente() {
    // Implement your delete logic here
    console.log('Eliminar expediente clicked');
  }
}