import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
export const AuthGuard: CanActivateFn = (route, state) => {
  return true; 
  /*
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn()) { 
    return true;
  } else {
    router.navigate(['/auth']); 
    return false;
  }
  */
}