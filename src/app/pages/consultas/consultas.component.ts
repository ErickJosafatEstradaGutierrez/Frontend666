// src/app/pages/consultas/consultas.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TokenService } from '../../pages/services/token.service';
import { AuthService } from '../../pages/services/auth.service';
import { ConsultaService } from '../../pages/services/consultas.service';
import { ConsultoriosService, Consultorio } from '../../pages/services/consultorios.service';
import { UsuarioService, Usuario } from '../../pages/services/usuarios.service';
import { provideAnimations } from '@angular/platform-browser/animations';
// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TextareaModule } from 'primeng/textarea';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';


@Component({
  selector: 'app-consulta',
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
            CardModule],
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css'],
  providers: [ConfirmationService, MessageService, provideAnimations()]
})
export class ConsultaComponent implements OnInit {
  consultas: any[] = [];
  consultorios: Consultorio[] = [];
  selectedConsulta: any = null;

  displayCreateDialog = false;
  displayEditDialog = false;
  displayViewDialog = false;

  medicos: Usuario[] = [];
  pacientes: Usuario[] = [];

  createForm!: FormGroup;
  editForm!: FormGroup;

  loading = false;
  loadingConsultorios = false;
  tiposConsulta = ['General', 'Especialidad', 'Urgencia', 'Control'];

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private tokenService: TokenService,
    private consultaService: ConsultaService,
    private consultorioService: ConsultoriosService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.cargarConsultas();
    this.cargarConsultorios();
    this.cargarMedicos();
    this.cargarPacientes();
  }

  /*
  ngOnCChanges(): void {
    // Aquí podrías recargar los datos si es necesario
    this.cargarConsultas();
    this.cargarConsultorios();
  }
  */

  private initializeForms() {
    // Cambio principal: NO deshabilitar los campos desde el inicio
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
      id: ['', Validators.required],
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

  puedeLeerConsultorios(): boolean {
    return this.tokenService.hasPermiso('read_consultorio');
  }

  // ================== CARGAR DATOS ==================
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

  cargarConsultorios(): void {
    if (!this.puedeLeerConsultorios()) {
      console.warn('No tienes permisos para ver consultorios');
      return;
    }

    this.loadingConsultorios = true;

    this.consultorioService.obtenerConsultorios().subscribe({
      next: (data) => {
        this.consultorios = data;
        this.loadingConsultorios = false;
        
        // Ya no es necesario habilitar los campos aquí
        // porque ya están habilitados desde el inicio
      },
      error: (err) => {
        this.loadingConsultorios = false;
        console.error('Error al cargar consultorios:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los consultorios'
        });
      }
    });
  }

  // ================== MÉTODOS AUXILIARES ==================
  obtenerNombreConsultorio(idConsultorio: number): string {
    const consultorio = this.consultorios.find(c => c.id === idConsultorio);
    return consultorio ? consultorio.nombre : `Consultorio ${idConsultorio}`;
  }

  obtenerDetallesConsultorio(idConsultorio: number): string {
    const consultorio = this.consultorios.find(c => c.id === idConsultorio);
    return consultorio ? `${consultorio.nombre} - ${consultorio.tipo} (${consultorio.ubicacion})` : `Consultorio ${idConsultorio}`;
  }

  // ================== CRUD OPERATIONS ==================
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
    
    // Recargar consultorios si no están cargados
    if (this.consultorios.length === 0) {
      this.cargarConsultorios();
    }
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

    // Asegurar que el valor del consultorio sea un número
    const formValue = { ...this.createForm.value };

    formValue.id_consultorio = parseInt(formValue.id_consultorio, 10);
    formValue.id_medico = parseInt(formValue.id_medico, 10);
    formValue.id_paciente = parseInt(formValue.id_paciente, 10);
    formValue.costo = parseFloat(formValue.costo);

    this.consultaService.crearConsulta(formValue).subscribe({
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
        console.error('Error al crear consulta:', err);
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

    // Crear una copia del objeto para evitar mutaciones
    const consultaParaEditar = { ...consulta };
    
    // Asignar el ID correcto para el formulario
    consultaParaEditar.id = consultaParaEditar.id_consulta;
    
    // Asegurar que los campos sean del tipo correcto
    consultaParaEditar.id_consultorio = parseInt(consultaParaEditar.id_consultorio, 10);
    consultaParaEditar.id_medico = parseInt(consultaParaEditar.id_medico, 10);
    consultaParaEditar.id_paciente = parseInt(consultaParaEditar.id_paciente, 10);
    consultaParaEditar.costo = parseFloat(consultaParaEditar.costo);

    this.selectedConsulta = consultaParaEditar;
    this.editForm.patchValue(consultaParaEditar);
    this.displayEditDialog = true;
    
    // Recargar consultorios si no están cargados
    if (this.consultorios.length === 0) {
      this.cargarConsultorios();
    }
  }

  mostrarEstadoFormulario() {
    console.log('Estado del formulario:', this.editForm.status);
    console.log('Errores:', this.editForm.errors);
    console.log('Valores:', this.editForm.value);
  }

  actualizarConsulta(): void {
  this.mostrarEstadoFormulario();
    if (this.editForm.invalid) {
    console.log('Formulario inválido - Razones:');
    Object.keys(this.editForm.controls).forEach(key => {
      const control = this.editForm.get(key);
      if (control?.invalid) {
        console.log(`Campo ${key} es inválido. Errores:`, control.errors);
      }
    });
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Por favor completa todos los campos requeridos'
      });
      return;
    }

    const formValue = { ...this.editForm.value };
    const id = formValue.id; // Usa el ID del formulario

    // Convertir los campos numéricos
    formValue.id_consultorio = parseInt(formValue.id_consultorio, 10);
    formValue.id_medico = parseInt(formValue.id_medico, 10);
    formValue.id_paciente = parseInt(formValue.id_paciente, 10);
    formValue.costo = parseFloat(formValue.costo);

    // Eliminar el campo id para no enviarlo duplicado
    delete formValue.id;

    this.consultaService.actualizarConsulta(id, formValue).subscribe({
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
        console.error('Error completo al actualizar:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.error || 'No se pudo actualizar la consulta'
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
    this.authService.logout(); // Habilita esto si deseas cerrar sesión automáticamente
  }

  cargarMedicos(): void {
    this.usuarioService.obtenerMedicos().subscribe({
      next: (data) => this.medicos = data,
      error: (err) => console.error('Error al cargar médicos:', err)
    });
  }

  cargarPacientes(): void {
    this.usuarioService.obtenerPacientes().subscribe({
      next: (data) => this.pacientes = data,
      error: (err) => console.error('Error al cargar pacientes:', err)
    });
  }

  obtenerNombreMedico(id: number): string {
    const medico = this.medicos.find(m => m.id === id);
    return medico ? medico.nombre : `ID ${id}`;
  }

  obtenerNombrePaciente(id: number): string {
    const paciente = this.pacientes.find(p => p.id === id);
    return paciente ? paciente.nombre : `ID ${id}`;
  }


}