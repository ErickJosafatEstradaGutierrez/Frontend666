import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
  providers: [MessageService],
})
export class CreateComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      id_paciente: ['', [Validators.required]],
      antecedentes: ['', [Validators.required]],
      historial: ['', [Validators.required]],
      seguro: ['', [Validators.required]],
    });
  }

  crearExpediente() {
    if (this.form.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Formulario inválido', detail: 'Completa todos los campos.' });
      return;
    }

    const datos = this.form.value;

    this.http.post<any>('http://localhost:3000/api/expedientes', datos).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Expediente creado correctamente.' });
        this.form.reset();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.error || 'No se pudo crear el expediente.' });
      },
    });
  }
}
