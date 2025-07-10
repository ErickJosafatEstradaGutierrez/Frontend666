// \src\app\pages\consultas\consultas.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TokenService } from '../../pages/services/token.service';
import { AuthService } from '../../pages/services/auth.service';
import { ConsultaService } from '../../pages/services/consultas.service';

@Component({
  selector: 'app-consulta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class ConsultaComponent implements OnInit {
  consultas: any[] = [];
  selectedConsulta: any = null;

  displayCreateDialog = false;
  displayEditDialog = false;
  displayViewDialog = false;

  createForm!: FormGroup;
  editForm!: FormGroup;

  loading = false;
  tiposConsulta = ['General', 'Especialidad', 'Urgencia', 'Control'];

  constructor(
    private fb: FormBuilder,
    private tokenService: TokenService,
    private consultaService: ConsultaService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.cargarConsultas();
  }

  private initializeForms() {
    this.createForm = this.fb.group({
      id_consultorio: ['', Validators.required],
      id_medico: ['', Validators.required],
      id_paciente: ['', Validators.required],
      tipo: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      diagnostico: ['', Validators.required],
      costo: ['', [Validators.required, Validators.min(0)]]
    });

    this.editForm = this.fb.group({
      id_consultorio: ['', Validators.required],
      id_medico: ['', Validators.required],
      id_paciente: ['', Validators.required],
      tipo: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      diagnostico: ['', Validators.required],
      costo: ['', [Validators.required, Validators.min(0)]]
    });
  }

  // ================== PERMISOS ==================
  puedeLeer(): boolean {
    return this.tokenService.hasPermiso('read_consulta');
  }

  puedeCrear(): boolean {
    return this.tokenService.hasPermiso('add_consulta');
  }

  puedeActualizar(): boolean {
    return this.tokenService.hasPermiso('update_consulta');
  }

  puedeEliminar(): boolean {
    return this.tokenService.hasPermiso('delete_consulta');
  }

  // ================== CARGAR CONSULTAS ==================
  cargarConsultas(): void {
    if (!this.puedeLeer()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Permiso denegado',
        detail: 'No tienes permisos para ver consultas'
      });
      return;
    }

    this.loading = true;

    this.consultaService.obtenerConsultas().subscribe({
      next: (data) => {
        this.consultas = data;
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
            detail: 'No se pudieron cargar las consultas'
          });
        }
      }
    });
  }

  abrirDialogoCrear(): void {
    if (!this.puedeCrear()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Permiso denegado',
        detail: 'No tienes permisos para crear consultas'
      });
      return;
    }

    this.createForm.reset();
    this.displayCreateDialog = true;
  }

  crearConsulta(): void {
    if (this.createForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Por favor completa todos los campos requeridos'
      });
      return;
    }

    this.consultaService.crearConsulta(this.createForm.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Consulta creada correctamente'
        });
        this.displayCreateDialog = false;
        this.cargarConsultas();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear la consulta'
        });
      }
    });
  }

  verConsulta(consulta: any): void {
    if (!this.puedeLeer()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Permiso denegado',
        detail: 'No tienes permisos para ver consultas'
      });
      return;
    }

    this.selectedConsulta = consulta;
    this.displayViewDialog = true;
  }

  abrirDialogoEditar(consulta: any): void {
    if (!this.puedeActualizar()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Permiso denegado',
        detail: 'No tienes permisos para editar consultas'
      });
      return;
    }

    this.selectedConsulta = consulta;
    this.editForm.patchValue(consulta);
    this.displayEditDialog = true;
  }

  actualizarConsulta(): void {
    if (this.editForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Por favor completa todos los campos requeridos'
      });
      return;
    }

    const id = this.selectedConsulta.id_consulta;

    this.consultaService.actualizarConsulta(id, this.editForm.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Consulta actualizada correctamente'
        });
        this.displayEditDialog = false;
        this.cargarConsultas();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar la consulta'
        });
      }
    });
  }

  confirmarEliminacion(consulta: any): void {
    if (!this.puedeEliminar()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Permiso denegado',
        detail: 'No tienes permisos para eliminar consultas'
      });
      return;
    }

    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar la consulta del paciente ${consulta.id_paciente}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.eliminarConsulta(consulta.id_consulta)
    });
  }

  eliminarConsulta(id: number): void {
    this.consultaService.eliminarConsulta(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Consulta eliminada correctamente'
        });
        this.cargarConsultas();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la consulta'
        });
      }
    });
  }

  cerrarDialogos(): void {
    this.displayCreateDialog = false;
    this.displayEditDialog = false;
    this.displayViewDialog = false;
    this.selectedConsulta = null;
  }

  private handleUnauthorized() {
    this.messageService.add({
      severity: 'error',
      summary: 'Sesión expirada',
      detail: 'Por favor vuelve a iniciar sesión'
    });
    // this.authService.logout(); // Habilita esto si deseas cerrar sesión automáticamente
  }
}
