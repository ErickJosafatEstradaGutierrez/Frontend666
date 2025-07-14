import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ 
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule, 
    HttpClientModule, 
    InputTextModule, 
    ButtonModule, 
    CardModule,
    DropdownModule,
    ToastModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService]
})
export class RegisterComponent {
  registerForm: FormGroup;
  secret: string = '';
  qrUrl: string = '';
  roles = [
    { name: 'Seleccione un rol', value: null },
    { name: 'Médico', value: 'medico' },
    { name: 'Paciente', value: 'paciente' },
    { name: 'Enfermera', value: 'enfermera' }
  ];

  campos = [
    { control: 'nombre', label: 'Nombre completo', placeholder: 'Juan Pérez', type: 'text' },
    { control: 'correo', label: 'Correo electrónico', placeholder: 'correo@empresa.com', type: 'email' },
    { control: 'password', label: 'Contraseña', placeholder: '••••••••••••', type: 'password' },
    { control: 'telefono', label: 'Teléfono', placeholder: '4421234567', type: 'text' },
  ];

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient, 
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      rol: [null, Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      telefono: ['', Validators.required],
      especialidad: [''], 
    });

    this.registerForm.get('rol')?.valueChanges.subscribe((rol) => {
      const especialidad = this.registerForm.get('especialidad');

      if (rol === 'medico') {
        especialidad?.setValidators(Validators.required);
      } else {
        especialidad?.clearValidators();
        especialidad?.setValue('');
      }
      especialidad?.updateValueAndValidity();
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    } else if (control?.hasError('email')) {
      return 'Correo electrónico inválido';
    } else if (control?.hasError('minlength')) {
      return `Mínimo ${control.errors?.['minlength'].requiredLength} caracteres`;
    }
    
    return '';
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor complete todos los campos requeridos correctamente',
        life: 5000
      });
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: (resp) => {
        this.secret = resp.secret;
        this.qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(resp.otpauth_url)}&size=200x200`;
        
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Por favor configura tu autenticación de dos factores',
          life: 5000
        });
      },
      error: (err) => {
        console.error('Error en registro:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error en registro',
          detail: err.error?.error || 'Error desconocido al registrar',
          life: 5000
        });
      }
    });
  }
}