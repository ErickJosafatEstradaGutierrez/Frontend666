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
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

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
    MessagesModule,
    PasswordModule,
    ToastModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService],
})
export class LoginComponent {
  loginForm: FormGroup;
  mensajeError: string = '';
  mensajesError: any[] = [];

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private tokenService: TokenService, 
    private router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      codigo_totp: ['', Validators.required],
    });
  }

  onSubmit() {
  if (this.loginForm.invalid) {
    return;
  }

  this.authService.login(this.loginForm.value).subscribe({
    next: (resp) => {
      const data = resp.Data?.[0];
      this.tokenService.setToken(data.access_token);
      this.tokenService.setPermisos(data.permisos);

      this.messageService.add({
        severity: 'success',
        detail: 'Bienvenido al sistema',
        life: 3000
      });

      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      const mensaje = err.error?.Data?.[0]?.mensaje || 'Error desconocido';
      this.messageService.add({
        severity: 'error',
        detail: 'Error al iniciar sesión: ' + mensaje,
        life: 5000
      });
    },
  });
}
}