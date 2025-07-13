// \src\app\pages\recetas\recetas.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TokenService } from '../services/token.service';
import { RecetaService } from '../../pages/services/receta.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UsuarioService, Usuario } from '../services/usuarios.service';
import { ConsultoriosService, Consultorio } from '../services/consultorios.service';

@Component({
  selector: 'app-recetas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recetas.component.html',
  styleUrls: ['./recetas.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class RecetasComponent implements OnInit {
  recetas: any[] = [];

  medicos: Usuario[] = [];
  pacientes: Usuario[] = [];
  consultorios: Consultorio[] = [];

  selectedReceta: any = null;

  displayCreateDialog = false;
  displayEditDialog = false;
  displayViewDialog = false;

  createForm!: FormGroup;
  editForm!: FormGroup;

  constructor(
    private usuarioService: UsuarioService,
    private consultorioService: ConsultoriosService,
    private fb: FormBuilder,
    private tokenService: TokenService,
    private recetaService: RecetaService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.cargarRecetas();
    this.cargarMedicos();
    this.cargarPacientes();
    this.cargarConsultorios();
  }

  initForms() {
    this.createForm = this.fb.group({
      id_consultorio: ['', Validators.required],
      id_medico: ['', Validators.required],
      id_paciente: ['', Validators.required],
      fecha: ['', Validators.required],
      medicamento: ['', Validators.required],
      dosis: ['', Validators.required]
    });

    this.editForm = this.fb.group({
      id_receta: [''],
      id_consultorio: ['', Validators.required],
      id_medico: ['', Validators.required],
      id_paciente: ['', Validators.required],
      fecha: ['', Validators.required],
      medicamento: ['', Validators.required],
      dosis: ['', Validators.required]
    });
  }

  // ================= PERMISOS =================
  puedeLeer() {
    return this.tokenService.hasPermiso('read_receta');
  }

  puedeCrear() {
    return this.tokenService.hasPermiso('add_receta');
  }

  puedeActualizar() {
    return this.tokenService.hasPermiso('update_receta');
  }

  puedeEliminar() {
    return this.tokenService.hasPermiso('delete_receta');
  }

  // ================= CRUD =================
  cargarRecetas() {
    if (!this.puedeLeer()) {
      this.messageService.add({ severity: 'warn', summary: 'Permiso denegado', detail: 'No puedes ver recetas' });
      return;
    }

    this.recetaService.obtenerTodas().subscribe({
      next: (data) => this.recetas = data,
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las recetas' });
      }
    });
  }

  abrirDialogoCrear() {
    if (!this.puedeCrear()) {
      this.messageService.add({ severity: 'warn', summary: 'Permiso denegado', detail: 'No puedes crear recetas' });
      return;
    }
    this.createForm.reset();
    this.displayCreateDialog = true;
  }

  crearReceta() {
    if (this.createForm.invalid) return;

    const formValue = { ...this.createForm.value };

    // Conversión explícita a número
    formValue.id_consultorio = Number(formValue.id_consultorio);
    formValue.id_medico = Number(formValue.id_medico);
    formValue.id_paciente = Number(formValue.id_paciente);

    this.recetaService.crear(formValue).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Receta creada' });
        this.displayCreateDialog = false;
        this.cargarRecetas();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear receta' });
      }
    });
  }

  abrirDialogoEditar(receta: any) {
    if (!this.puedeActualizar()) return;
    this.selectedReceta = receta;
    this.editForm.patchValue(receta);
    this.displayEditDialog = true;
  }

  actualizarReceta() {
    if (this.editForm.invalid) return;

    this.recetaService.actualizar(this.selectedReceta.id_receta, this.editForm.value).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Receta actualizada' });
        this.displayEditDialog = false;
        this.cargarRecetas();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' });
      }
    });
  }

  verReceta(receta: any) {
    this.selectedReceta = receta;
    this.displayViewDialog = true;
  }

  confirmarEliminacion(receta: any) {
    if (!this.puedeEliminar()) return;

    this.confirmationService.confirm({
      message: `¿Eliminar receta del paciente ${receta.id_paciente}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.eliminarReceta(receta.id_receta)
    });
  }

  eliminarReceta(id: number) {
    this.recetaService.eliminar(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Receta eliminada' });
        this.cargarRecetas();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar' });
      }
    });
  }

  cargarMedicos() {
    this.usuarioService.obtenerMedicos().subscribe({
      next: (data) => this.medicos = data,
      error: (err) => console.error('Error al cargar médicos:', err)
    });
  }

  cargarPacientes() {
    this.usuarioService.obtenerPacientes().subscribe({
      next: (data) => this.pacientes = data,
      error: (err) => console.error('Error al cargar pacientes:', err)
    });
  }

  cargarConsultorios() {
    this.consultorioService.obtenerConsultorios().subscribe({
      next: (data) => this.consultorios = data,
      error: (err) => console.error('Error al cargar consultorios:', err)
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

  obtenerNombreConsultorio(id: number): string {
    const consultorio = this.consultorios.find(c => c.id === id);
    return consultorio ? consultorio.nombre : `ID ${id}`;
  }


  cerrarDialogos() {
    this.displayCreateDialog = false;
    this.displayEditDialog = false;
    this.displayViewDialog = false;
    this.selectedReceta = null;
  }
}
