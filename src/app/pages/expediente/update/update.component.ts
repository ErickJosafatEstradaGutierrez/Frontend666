// \src\app\pages\expediente\update\update.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule
  ],
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
  providers: [MessageService]
})
export class UpdateExpComponent implements OnInit {
  form: FormGroup;
  id: number;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      id_paciente: ['', [Validators.required]],
      antecedentes: ['', [Validators.required]],
      historial: ['', [Validators.required]],
      seguro: ['', [Validators.required]],
    });
    this.id = parseInt(this.route.snapshot.paramMap.get('id') || '0');
  }

  ngOnInit() {
    this.http.get<any>(`http://localhost:3000/api/expedientes/${this.id}`).subscribe({
      next: (data) => this.form.patchValue(data),
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el expediente'
        });
        this.router.navigate(['/expedientes']);
      }
    });
  }

  actualizarExpediente() {
    if (this.form.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Completa todos los campos.'
      });
      return;
    }

    this.http.put<any>(`http://localhost:3000/api/expedientes/${this.id}`, this.form.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Expediente actualizado correctamente'
        });
        this.router.navigate(['/expedientes']);
      },
      error: (err) => this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: err.error?.error || 'No se pudo actualizar el expediente'
      })
    });
  }
}