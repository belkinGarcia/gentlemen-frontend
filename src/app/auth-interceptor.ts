import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service'; // <-- Importamos el servicio que acabamos de crear

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  /**
   * Intercepta las peticiones HTTP salientes para añadir el token de autorización.
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = this.authService.getToken();

    // Si tenemos un token, clonamos la petición y le añadimos la cabecera 'Authorization'.
    if (authToken) {
      const authReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${authToken}`)
      });
      return next.handle(authReq);
    }

    // Si no hay token, la petición continúa sin modificarse.
    return next.handle(request);
  }
}
