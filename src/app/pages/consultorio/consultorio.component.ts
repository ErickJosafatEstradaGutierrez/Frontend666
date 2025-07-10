// \src\app\pages\consultorios\consultorios.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TokenService } from '../../pages/services/token.service';
import { ConsultoriosService } from '../services/consultorios.service';

@Component({
  selector: 'app-consultorios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule
  ],
  templateUrl: './consultorio.component.html',
  styleUrls: ['./consultorio.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class ConsultoriosComponent implements OnInit {
  consultorios: any[] = [];
  selectedConsultorio: any = null;
  
  // Diálogos
  displayCreateDialog = false;
  displayEditDialog = false;
  displayViewDialog = false;
  
  // Formularios
  createForm: FormGroup;
  editForm: FormGroup;
  
  // Estados
  loading = false;

  constructor(
    private fb: FormBuilder,
    private tokenService: TokenService,
    private consultoriosService: ConsultoriosService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.createForm = this.fb.group({
      id_medico: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      tipo: ['', [Validators.required]],
      ubicacion: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      telefono: ['', [Validators.required]]
    });

    this.editForm = this.fb.group({
      id_consultorio: [''],
      id_medico: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      tipo: ['', [Validators.required]],
      ubicacion: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      telefono: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.cargarConsultorios();
  }

  // =============== MÉTODOS DE PERMISOS ===============
  puedeLeer(): boolean {
    return this.tokenService.hasPermiso('read_consultorio');
  }

  puedeCrear(): boolean {
    return this.tokenService.hasPermiso('add_consultorio');
  }

  puedeActualizar(): boolean {
    return this.tokenService.hasPermiso('update_consultorio');
  }

  puedeEliminar(): boolean {
    return this.tokenService.hasPermiso('delete_consultorio');
  }

  // =============== OPERACIONES CRUD ===============
  cargarConsultorios() {
    if (!this.puedeLeer()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Permiso denegado',
        detail: 'No tienes permisos para ver consultorios'
      });
      return;
    }

    this.loading = true;
    this.consultoriosService.obtenerConsultorios().subscribe({
      next: (data) => {
        this.consultorios = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los consultorios'
        });
      }
    });
  }

  // ========== CREAR CONSULTORIO ==========
  abrirDialogoCrear() {
    if (!this.puedeCrear()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Permiso denegado',
        detail: 'No tienes permisos para crear consultorios'
      });
      return;
    }
    
    this.createForm.reset();
    this.displayCreateDialog = true;
  }

  crearConsultorio() {
    if (this.createForm.invalid) {
      this.marcarCamposInvalidos(this.createForm);
      return;
    }

    this.consultoriosService.crearConsultorio(this.createForm.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Consultorio creado correctamente'
        });
        this.displayCreateDialog = false;
        this.cargarConsultorios();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear el consultorio'
        });
      }
    });
  }

  // ========== VER CONSULTORIO ==========
  verConsultorio(consultorio: any) {
    if (!this.puedeLeer()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Permiso denegado',
        detail: 'No tienes permisos para ver consultorios'
      });
      return;
    }

    this.selectedConsultorio = consultorio;
    this.displayViewDialog = true;
  }

  // ========== EDITAR CONSULTORIO ==========
  abrirDialogoEditar(consultorio: any) {
    if (!this.puedeActualizar()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Permiso denegado',
        detail: 'No tienes permisos para editar consultorios'
      });
      return;
    }

    this.selectedConsultorio = consultorio;
    this.editForm.patchValue(consultorio);
    this.displayEditDialog = true;
  }

  actualizarConsultorio() {
    if (this.editForm.invalid) {
      this.marcarCamposInvalidos(this.editForm);
      return;
    }

    const id = this.selectedConsultorio.id_consultorio;
    this.consultoriosService.actualizarConsultorio(id, this.editForm.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Consultorio actualizado correctamente'
        });
        this.displayEditDialog = false;
        this.cargarConsultorios();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el consultorio'
        });
      }
    });
  }

  // ========== ELIMINAR CONSULTORIO ==========
  confirmarEliminacion(consultorio: any) {
    if (!this.puedeEliminar()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Permiso denegado',
        detail: 'No tienes permisos para eliminar consultorios'
      });
      return;
    }

    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el consultorio ${consultorio.nombre}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.eliminarConsultorio(consultorio.id_consultorio)
    });
  }

  eliminarConsultorio(id: number) {
    this.consultoriosService.eliminarConsultorio(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Consultorio eliminado correctamente'
        });
        this.cargarConsultorios();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el consultorio'
        });
      }
    });
  }

  // ========== UTILIDADES ==========
  private marcarCamposInvalidos(form: FormGroup) {
    Object.values(form.controls).forEach(control => {
      control.markAsDirty();
    });
    this.messageService.add({
      severity: 'warn',
      summary: 'Formulario inválido',
      detail: 'Por favor completa todos los campos requeridos'
    });
  }

  cerrarDialogos() {
    this.displayCreateDialog = false;
    this.displayEditDialog = false;
    this.displayViewDialog = false;
    this.selectedConsultorio = null;
  }
}