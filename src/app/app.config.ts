import { ApplicationConfig } from '@angular/core';
// 1. IMPORTA 'withInMemoryScrolling'
import { provideRouter, withRouterConfig, withInMemoryScrolling } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth-interceptor'; 

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    
    // 2. CONFIGURA EL ROUTER ASÍ
    provideRouter(
      routes,
      // Esta función es para otras opciones, como 'onSameUrlNavigation'
      withRouterConfig({}), 
      
      // Esta es la función correcta para el scroll
      withInMemoryScrolling({ 
        scrollPositionRestoration: 'top' 
      })
    ),

    // Tu configuración de HttpClient e Interceptor (esta parte está bien)
    provideHttpClient(withInterceptorsFromDi()), 
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, 
      multi: true 
    },
    provideNativeDateAdapter()
  ]
};