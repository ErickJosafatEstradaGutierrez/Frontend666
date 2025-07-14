import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HorarioService, Horario } from '../services/horario.service';
import { TokenService } from '../services/token.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@Component({
  selector: 'app-horario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule
],
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class HorarioComponent implements OnInit {
  horarios: Horario[] = [];

  selectedHorario: Horario | null = null;

  displayCreateDialog = false;
  displayEditDialog = false;
  displayViewDialog = false;

  createForm!: FormGroup;
  editForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private horarioService: HorarioService,
    private tokenService: TokenService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.cargarHorarios();
  }

  initForms() {
    this.createForm = this.fb.group({
      id_consultorio: ['', Validators.required],
      id_medico: ['', Validators.required],
      id_consulta: [null],
      turno: ['', Validators.required],
      dia: ['', Validators.required]
    });

    this.editForm = this.fb.group({
      id_horario: [''],
      id_consultorio: ['', Validators.required],
      id_medico: ['', Validators.required],
      id_consulta: [null],
      turno: ['', Validators.required],
      dia: ['', Validators.required]
    });
  }

  // ================= PERMISOS =================
  puedeLeer() {
    return this.tokenService.hasPermiso('read_horario');
  }

  puedeCrear() {
    return this.tokenService.hasPermiso('add_horario');
  }

  puedeActualizar() {
    return this.tokenService.hasPermiso('update_horario');
  }

  puedeEliminar() {
    return this.tokenService.hasPermiso('delete_horario');
  }

  // ================= CRUD =================
  cargarHorarios() {
    if (!this.puedeLeer()) {
      this.messageService.add({ severity: 'warn', summary: 'Permiso denegado', detail: 'No puedes ver horarios' });
      return;
    }

    this.horarioService.obtenerHorarios().subscribe({
      next: (data) => {
        this.horarios = data;
      },
      error: (err) => {
        console.error('Error al cargar horarios:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los horarios' });
      }
    });
  }


  abrirDialogoCrear() {
    if (!this.puedeCrear()) {
      this.messageService.add({ severity: 'warn', summary: 'Permiso denegado', detail: 'No puedes crear horarios' });
      return;
    }
    this.createForm.reset();
    this.displayCreateDialog = true;
  }

  crearHorario() {
    if (this.createForm.invalid) return;

    const data = { ...this.createForm.value };
    data.id_consultorio = Number(data.id_consultorio);
    data.id_medico = Number(data.id_medico);

    this.horarioService.crearHorario(data).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Horario creado' });
        this.displayCreateDialog = false;
        this.cargarHorarios();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el horario' });
      }
    });
  }

  abrirDialogoEditar(horario: Horario) {
    if (!this.puedeActualizar()) return;
    this.selectedHorario = horario;
    this.editForm.patchValue(horario);
    this.displayEditDialog = true;
  }

  actualizarHorario() {
    if (this.editForm.invalid || !this.selectedHorario) return;

    const id = this.selectedHorario.id_horario!;
    const data = this.editForm.value;

    this.horarioService.actualizarHorario(id, data).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Horario actualizado' });
        this.displayEditDialog = false;
        this.cargarHorarios();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el horario' });
      }
    });
  }

  confirmarEliminacion(horario: Horario) {
    if (!this.puedeEliminar()) return;

    this.confirmationService.confirm({
      message: `¿Eliminar horario del día ${horario.dia} (${horario.turno})?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.eliminarHorario(horario.id_horario!)
    });
  }

  eliminarHorario(id: number) {
    this.horarioService.eliminarHorario(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Horario eliminado' });
        this.cargarHorarios();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el horario' });
      }
    });
  }

  cerrarDialogos() {
    this.displayCreateDialog = false;
    this.displayEditDialog = false;
    this.displayViewDialog = false;
    this.selectedHorario = null;
  }
}
