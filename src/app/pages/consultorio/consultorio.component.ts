// \src\app\pages\consultorios\consultorios.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { UsuarioService, Usuario } from '../services/usuarios.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TokenService } from '../../pages/services/token.service';
import { ConsultoriosService } from '../services/consultorios.service';
// PrimeNG imports
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TextareaModule } from 'primeng/textarea';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-consultorios',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
    TextareaModule,
    ToolbarModule,
    ConfirmDialogModule,
    ToastModule,
    CardModule
  ],
  templateUrl: './consultorio.component.html',
  styleUrls: ['./consultorio.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class ConsultoriosComponent implements OnInit {
  consultorios: any[] = [];
  selectedConsultorio: any = null;
  
  medicos: Usuario[] = [];

  // Diálogos
  displayCreateDialog = false;
  displayEditDialog = false;
  displayViewDialog = false;
  
  tiposConsultorio: string[] = [
    'General',
    'Especializado',
    'Odontología',
    'Pediatría',
    'Cirugía'
    // Add other types as needed
  ];

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
    private messageService: MessageService,
    private usuarioService: UsuarioService
  ) {
    this.createForm = this.fb.group({
      id_medico: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      ubicacion: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });

    this.editForm = this.fb.group({
      id: [''],
      id_medico: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      ubicacion: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });
  }

  ngOnInit() {
    this.cargarConsultorios();
    this.cargarMedicos();
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
        console.log('Datos recibidos:', data);
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

  // Añade este método para cargar los médicos
  cargarMedicos(): void {
    this.usuarioService.obtenerMedicos().subscribe({
      next: (data) => this.medicos = data,
      error: (err) => console.error('Error al cargar médicos:', err)
    });
  }

  // Añade este método auxiliar para mostrar el nombre del médico
  obtenerNombreMedico(id: number): string {
    const medico = this.medicos.find(m => m.id === id);
    return medico ? medico.nombre : `ID ${id}`;
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

    const formData = this.createForm.value;
    
    // Convertir id_medico a número
    formData.id_medico = Number(formData.id_medico);

    this.consultoriosService.crearConsultorio(formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Consultorio creado correctamente'
        });
        this.displayCreateDialog = false;
        this.cargarConsultorios();
      },
      error: (error) => {
        console.error('Error completo:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.error || 'No se pudo crear el consultorio'
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
      this.editForm.patchValue({
          id: consultorio.id,
          id_medico: consultorio.id_medico,
          tipo: consultorio.tipo,
          ubicacion: consultorio.ubicacion,
          nombre: consultorio.nombre,
          telefono: consultorio.telefono
      });
      this.displayEditDialog = true;
  }

  actualizarConsultorio() {
    if (this.editForm.invalid) {
      this.marcarCamposInvalidos(this.editForm);
      return;
    }

    const formData = this.editForm.value;
    const id = formData.id;

    // Prepara los datos en el formato que espera el backend
    const datosActualizados = {
      id_medico: formData.id_medico,
      tipo: formData.tipo,
      ubicacion: formData.ubicacion,
      nombre: formData.nombre,
      telefono: formData.telefono
    };

    this.consultoriosService.actualizarConsultorio(id, datosActualizados).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Consultorio actualizado correctamente'
        });
        this.displayEditDialog = false;
        this.cargarConsultorios();
      },
      error: (error) => {
        console.error('Error al actualizar:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'No se pudo actualizar el consultorio'
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
      accept: () => this.eliminarConsultorio(consultorio.id)
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