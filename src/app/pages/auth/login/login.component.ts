//login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    MessageModule,
    MessagesModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  mensajeError: string = '';
  mensajesError: any[] = [];

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      codigo_totp: ['', Validators.required],
    });
  }

  onSubmit() {
    console.log('onSubmit ejecutado');
    if (this.loginForm.invalid) {
      console.log('Formulario inválido', this.loginForm.value);
      return;
    }
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe({
      next: (resp) => {
        localStorage.setItem('access_token', resp.access_token);
        localStorage.setItem('refresh_token', resp.refresh_token);
        // Redirigir a dashboard
      },
      error: (err) => {
        this.mensajeError = err.error?.Data?.[0]?.mensaje || 'Error desconocido';
        this.mensajesError = [{ severity: 'error', summary: 'Error', detail: this.mensajeError }];
      },
    });
  }
}
