import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule, InputTextModule, ButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  secret: string = '';
  qrUrl: string = '';

  campos = [
    { control: 'nombre', label: 'Nombre completo', placeholder: 'Ej. Juan Pérez', type: 'text' },
    { control: 'rol', label: 'Rol', placeholder: 'Ej. doctor', type: 'text' },
    { control: 'correo', label: 'Correo electrónico', placeholder: 'correo@empresa.com', type: 'email' },
    { control: 'password', label: 'Contraseña', placeholder: '••••••••••••', type: 'password' },
    { control: 'telefono', label: 'Teléfono', placeholder: 'Ej. 4421234567', type: 'text' },
    { control: 'especialidad', label: 'Especialidad', placeholder: 'Ej. Cardiología', type: 'text' }
  ];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      rol: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      telefono: ['', Validators.required],
      especialidad: ['', Validators.required],
    });
  }

  onRegister() {
    if (this.registerForm.invalid) return;

    this.http.post<any>('http://localhost:3000/api/register', this.registerForm.value).subscribe({
      next: (resp) => {
        this.secret = resp.secret;
        // Generar QR desde otpauth_url usando api externa de generación
        this.qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(resp.otpauth_url)}&size=200x200`;
      },
      error: (err) => {
        console.error('Error en registro:', err);
        alert(err.error?.error || 'Error desconocido');
      }
    });
  }
}
