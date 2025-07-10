// src/app/pages/horario/horario.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HorarioService, Horario } from '../services/horario.service';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class HorarioComponent implements OnInit {
  horarios: Horario[] = [];
  displayCreateDialog = false;
  displayEditDialog = false;
  selectedHorario: Horario | null = null;
  createForm!: FormGroup;
  editForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private horarioService: HorarioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initForms();
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
      id_consultorio: ['', Validators.required],
      id_medico: ['', Validators.required],
      id_consulta: [null],
      turno: ['', Validators.required],
      dia: ['', Validators.required]
    });
  }

  cargarHorarios() {
    this.loading = true;
    this.horarioService.obtenerHorarios().subscribe({
      next: (data) => {
        this.horarios = data;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar horarios' });
        this.loading = false;
      }
    });
  }

  abrirDialogoCrear() {
    this.createForm.reset();
    this.displayCreateDialog = true;
  }

  crearHorario() {
    if (this.createForm.invalid) return;

    const data = this.createForm.value;
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
    this.selectedHorario = horario;
    this.editForm.patchValue(horario);
    this.displayEditDialog = true;
  }

  actualizarHorario() {
    if (!this.selectedHorario || this.editForm.invalid) return;

    const id = this.selectedHorario.id_horario!;
    const data = this.editForm.value;

    this.horarioService.actualizarHorario(id, data).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Horario actualizado' });
        this.displayEditDialog = false;
        this.cargarHorarios();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar' });
      }
    });
  }

  confirmarEliminacion(horario: Horario) {
    this.confirmationService.confirm({
      message: `¿Eliminar horario del día ${horario.dia} (${horario.turno})?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.eliminarHorario(horario.id_horario!)
    });
  }

  eliminarHorario(id: number) {
    this.horarioService.eliminarHorario(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Horario eliminado' });
        this.cargarHorarios();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar' });
      }
    });
  }

  cerrarDialogos() {
    this.displayCreateDialog = false;
    this.displayEditDialog = false;
    this.selectedHorario = null;
  }
}
