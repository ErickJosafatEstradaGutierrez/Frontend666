// \src\app\pages\expediente\expediente.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TokenService } from '../../pages/services/token.service';
import { TableModule } from 'primeng/table';
import { ExpedienteService } from '../services/expediente.service';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../pages/services/auth.service';

@Component({
  selector: 'app-expediente',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule
  ],
  templateUrl: './expediente.component.html',
  styleUrls: ['./expediente.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class ExpedienteComponent {
  expedientes: any[] = [];
  selectedExpediente: any;
  displayDialog = false;
  tokenReady = false;

  constructor(
    private tokenService: TokenService,
    private expedienteService: ExpedienteService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarExpedientes();
  }

   private verifyToken() {
    const checkToken = () => {
      const token = this.tokenService.getToken();
      if (token) {
        this.tokenReady = true;
        this.cargarExpedientes();
      } else {
        setTimeout(checkToken, 100);
      }
    };
    checkToken();
  }

  cargarExpedientes() {
    if (!this.puedeLeer()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Permiso denegado',
        detail: 'No tienes permisos para ver expedientes'
      });
      return;
    }

    this.expedienteService.obtenerExpedientes().subscribe({
      next: (data) => this.expedientes = data,
      error: (err) => {
        if (err.status === 401) {
          this.handleUnauthorized();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los expedientes'
          });
        }
      }
    });
  }

  private handleUnauthorized() {
    this.messageService.add({
      severity: 'error',
      summary: 'Sesión expirada',
      detail: 'Por favor vuelve a iniciar sesión'
    });
    //this.authService.logout(); // Método para limpiar el token y redirigir
  }

  puedeLeer(): boolean {
    return this.tokenService.hasPermiso('read_expediente');
  }

  puedeCrear(): boolean {
    return this.tokenService.hasPermiso('add_expediente');
  }

  puedeActualizar(): boolean {
    return this.tokenService.hasPermiso('update_expediente');
  }

  puedeEliminar(): boolean {
    return this.tokenService.hasPermiso('delete_expediente');
  }

  confirmarEliminacion(id: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar este expediente?',
      accept: () => this.eliminarExpediente(id)
    });
  }

  eliminarExpediente(id: number) {
    this.expedienteService.eliminarExpediente(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Expediente eliminado correctamente'
        });
        this.cargarExpedientes();
      },
      error: (err) => this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo eliminar el expediente'
      })
    });
  }
}