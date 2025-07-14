// \src\app\pages\expediente\expediente.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../pages/services/token.service';
import { ExpedienteService } from '../services/expediente.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../pages/services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { UsuarioService, Usuario } from '../services/usuarios.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@Component({
  selector: 'app-expediente',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule
  ],
  templateUrl: './expediente.component.html',
  styleUrls: ['./expediente.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class ExpedienteComponent implements OnInit {
  expedientes: any[] = [];
  selectedExpediente: any = null;
  pacientes: Usuario[] = [];
  
  // Diálogos
  displayCreateDialog = false;
  displayEditDialog = false;
  displayViewDialog = false;
  
  // Formularios
  createForm!: FormGroup;
  editForm!: FormGroup;
  
  // Estados
  loading = false;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private tokenService: TokenService,
    private expedienteService: ExpedienteService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService,
    private usuarioService: UsuarioService,
  ) {
    this.initializeForms();
  }

  ngOnInit() {
    this.cargarExpedientes();
    this.cargarPacientes();
  }

  private initializeForms() {
    this.createForm = this.fb.group({
      id_paciente: ['', [Validators.required]],
      antecedentes: ['', [Validators.required]],
      historial: ['', [Validators.required]],
      seguro: ['', [Validators.required]]
    });

    this.editForm = this.fb.group({
      id_expediente: [''],
      id_paciente: ['', [Validators.required]],
      antecedentes: ['', [Validators.required]],
      historial: ['', [Validators.required]],
      seguro: ['', [Validators.required]]
    });
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

    this.loading = true;
    this.expedienteService.obtenerExpedientes().subscribe({
      next: (data) => {
        this.expedientes = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
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

  // =============== MÉTODOS DE PERMISOS ===============
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

  // =============== OPERACIONES CRUD ===============

  // ========== CREAR EXPEDIENTE ==========
  abrirDialogoCrear() {
    if (!this.puedeCrear()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Permiso denegado',
        detail: 'No tienes permisos para crear expedientes'
      });
      return;
    }
    
    this.createForm.reset();
    this.displayCreateDialog = true;
  }

  crearExpediente() {
    if (this.createForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Por favor completa todos los campos requeridos'
      });
      return;
    }

    const expedienteData = {
      ...this.createForm.value,
      id_paciente: Number(this.createForm.value.id_paciente),
    };
    
    this.expedienteService.crearExpediente(expedienteData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Expediente creado correctamente'
        });
        this.displayCreateDialog = false;
        this.cargarExpedientes();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear el expediente'
        });
      }
    });
  }

  // ========== VER EXPEDIENTE ==========
  verExpediente(expediente: any) {
    if (!this.puedeLeer()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Permiso denegado',
        detail: 'No tienes permisos para ver expedientes'
      });
      return;
    }

    this.selectedExpediente = expediente;
    this.displayViewDialog = true;
  }

  // ========== EDITAR EXPEDIENTE ==========
  abrirDialogoEditar(expediente: any) {
    if (!this.puedeActualizar()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Permiso denegado',
        detail: 'No tienes permisos para editar expedientes'
      });
      return;
    }

    this.selectedExpediente = expediente;
    this.editForm.patchValue(expediente);
    this.displayEditDialog = true;
  }

  actualizarExpediente() {
    if (this.editForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Por favor completa todos los campos requeridos'
      });
      return;
    }

    const expedienteData = this.editForm.value;
    const id = this.selectedExpediente.id_expediente;

    this.expedienteService.actualizarExpediente(id, expedienteData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Expediente actualizado correctamente'
        });
        this.displayEditDialog = false;
        this.cargarExpedientes();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el expediente'
        });
      }
    });
  }

  // ========== ELIMINAR EXPEDIENTE ==========
  confirmarEliminacion(expediente: any) {
    if (!this.puedeEliminar()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Permiso denegado',
        detail: 'No tienes permisos para eliminar expedientes'
      });
      return;
    }

    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el expediente del paciente ${expediente.id_paciente}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.eliminarExpediente(expediente.id_expediente)
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
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el expediente'
        });
      }
    });
  }

  // ========== UTILIDADES ==========
  private handleUnauthorized() {
    this.messageService.add({
      severity: 'error',
      summary: 'Sesión expirada',
      detail: 'Por favor vuelve a iniciar sesión'
    });
    // Opcional: redirigir al login
    // this.authService.logout();
  }

  cargarPacientes() {
    this.usuarioService.obtenerPacientes().subscribe({
      next: (data) => this.pacientes = data,
      error: (err) => console.error('Error al cargar pacientes:', err)
    });
  }

  obtenerNombrePaciente(id: number): string {
    const paciente = this.pacientes.find(p => p.id === id);
    return paciente ? paciente.nombre : `ID ${id}`;
  }

  cerrarDialogos() {
    this.displayCreateDialog = false;
    this.displayEditDialog = false;
    this.displayViewDialog = false;
    this.selectedExpediente = null;
  }
}