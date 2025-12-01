import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../app/services/auth.service'; // Ajusta la ruta si es necesario

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    // 1. Verificar si es Admin usando la lógica corregida del servicio
    if (this.authService.isAdmin()) {
      console.log('AdminGuard: Acceso permitido');
      return true;
    }

    // 2. Si no es admin, denegar acceso y redirigir
    console.warn('AdminGuard: Acceso denegado. Usuario no es ADMINISTRADOR.');

    // Si está logueado pero no es admin, mándalo a "Mi Cuenta"
    if (this.authService.isLoggedIn()) {
        return this.router.createUrlTree(['/mi-cuenta']);
    }

    // Si no está logueado, al login
    return this.router.createUrlTree(['/auth']);
  }
}
