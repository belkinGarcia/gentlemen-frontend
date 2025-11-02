// src/app/admin-guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const AdminGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true; // <-- El usuario es Admin, puede pasar
  } else {
    // Si no es admin, redirige al home (o a 'no autorizado')
    console.warn("AdminGuard: Acceso denegado.");
    router.navigate(['/']);
    return false;
  }
};