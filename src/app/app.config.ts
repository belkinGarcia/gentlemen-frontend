import { ApplicationConfig } from '@angular/core';
import { provideRouter, withRouterConfig, withInMemoryScrolling } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // <--- 1. IMPORTAR ESTO

// Importamos withFetch para mejor rendimiento
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth-interceptor'; 
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withRouterConfig({}), 
      withInMemoryScrolling({ 
        scrollPositionRestoration: 'top' 
      })
    ),
    // 2. AGREGAR provideAnimationsAsync()
    provideAnimationsAsync(), 

    // 3. AGREGAR withFetch() aquí dentro
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch() 
    ), 
    
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, 
      multi: true 
    },
    provideNativeDateAdapter()
  ]
};