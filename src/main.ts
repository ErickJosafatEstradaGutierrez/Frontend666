//main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { provideAnimations } from '@angular/platform-browser/animations'; 
import { LoginComponent } from './app/pages/auth/login/login.component'; 
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers!,
    provideAnimations(),
    MessageService
  ]
});
