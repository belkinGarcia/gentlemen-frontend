import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service'; // Asegúrate de que la ruta sea correcta

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    // 1. Obtener el token actual
    const token = this.authService.getToken();

    // 2. Si existe el token, clonar la petición y añadir el header Authorization
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // 3. Pasar la petición y manejar errores globales (como token expirado)
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si el backend devuelve 401 (No autorizado), es probable que el token venció
        if (error.status === 401) {
          this.authService.logout(); // Limpiar sesión
          this.router.navigate(['/auth']); // Redirigir al login
        }
        return throwError(() => error);
      })
    );
  }
}