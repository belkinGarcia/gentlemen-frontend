// src/app/auth.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service'; // Asegúrate que la ruta a tu servicio sea correcta

export const AuthGuard: CanActivateFn = (route, state) => {

  // ==============================================
  // == INICIO DE LA SIMULACIÓN (Hack Rápido) ==
  // ==============================================

  // Forzamos el acceso para ver los cambios de diseño.
  return true; 
  
  /*
  // --- LÓGICA ORIGINAL (Comentada temporalmente) ---
  
  const authService = inject(AuthService);
  const router = inject(Router);

  // Le preguntamos al AuthService si el usuario está logueado
  if (authService.isLoggedIn()) { 
    return true; // SÍ, puede pasar a la ruta
  } else {
    // NO está logueado. Lo redirigimos a la página de login
    // (Asegúrate que esta ruta '/auth' sea la correcta)
    router.navigate(['/auth']); 
    return false; // NO, no puede pasar
  }
  
  // ==============================================
  // == FIN DE LA SIMULACIÓN ==
  // ==============================================
  */
}