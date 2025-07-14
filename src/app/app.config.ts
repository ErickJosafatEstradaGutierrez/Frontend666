// app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './pages/services/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations'; 
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

  const MyPreset = definePreset(Aura, {
    semantic: {
      surface: {
        0: '#FFFFFF', // Fondo base blanco
        50: '#F8F9FA' // Fondo secundario casi blanco
      },
      text: {
        900: '#1F1F1F' // Texto oscuro para contraste
      }
    }
  });


export const appConfig: ApplicationConfig = {

  providers: [
    MessageService,
    provideRouter(routes),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideAnimations(),
    providePrimeNG({
        theme: {
            preset: MyPreset,
            options: {
              darkModeSelector: '.my-app-dark', // Selector para activar el modo oscuro
            }
        }
    })
  ]
};