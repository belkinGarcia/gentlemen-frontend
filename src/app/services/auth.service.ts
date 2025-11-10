import { Injectable } from '@angular/core';
import { Observable, tap, BehaviorSubject, of, delay } from 'rxjs';
import { Router } from '@angular/router';
const MOCK_USER = {
  id: 1,
  firstName: 'Belkin',
  lastName: 'de Prueba',
  dni: '12345678',
  email: 'prueba@gmail.com',
  phone: '987654321',
  role: 'USER',
  district: 'Miraflores' 
};
const MOCK_ADMIN = {
  id: 99,
  firstName: 'Admin',
  lastName: 'Principal',
  dni: '99999999',
  email: 'admin@admin.com',
  phone: '999888777',
  role: 'ADMIN',
  district: 'Oficina'
};
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLE_KEY = 'user_role';
  private readonly USER_KEY = 'auth_user';
  private loggedInStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  public loggedIn$ = this.loggedInStatus.asObservable();
  constructor(
    private router: Router
  ) {}
  /**
   * Simula el inicio de sesión.
   * Si el email es 'admin@admin.com', loguea como Admin.
   * Para cualquier otro email, loguea como MOCK_USER.
   */
  login(credentials: any): Observable<any> {
    console.log('--- MOCK LOGIN ---', credentials);
    let fakeResponse: any;
    if (credentials.username === 'admin@admin.com') {
      console.log('¡Iniciando sesión como ADMIN!');
      fakeResponse = {
        token: 'fake-admin-jwt-token-999999',
        role: MOCK_ADMIN.role,
        user: MOCK_ADMIN
      };
    } else {
      console.log('Iniciando sesión como USER');
      fakeResponse = {
        token: 'fake-jwt-token-123456789',
        role: MOCK_USER.role,
        user: MOCK_USER
      };
    }
    this.setSession(fakeResponse);
    return of(fakeResponse).pipe(delay(500));
  }
  /**
   * Simula el registro de un nuevo usuario.
   * Devuelve los datos del usuario.
   */
  register(userData: any): Observable<any> {
    console.log('--- MOCK REGISTER ---', userData);
    const fakeResponse = {
      user: userData 
    };
    return of(fakeResponse).pipe(delay(1000));
  }
  /**
   * Guarda la sesión completa en localStorage y notifica a la app.
   */
  private setSession(response: any): void {
    if (response && response.token && response.user) { 
      localStorage.setItem(this.TOKEN_KEY, response.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
      if (response.role) {
        localStorage.setItem(this.ROLE_KEY, response.role);
      }
      this.loggedInStatus.next(true);
    } else {
      console.error('Respuesta de login inválida, faltan datos:', response);
    }
  }
  /**
   * Limpia la sesión de localStorage y notifica a la app.
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.loggedInStatus.next(false);
    this.router.navigate(['/']);
  }
  /**
   * Obtiene el token JWT.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  /**
   * Revisa si el usuario está logueado (si existe un token).
   */
  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return !!token;
  }
  /**
   * Obtiene los datos del usuario logueado desde localStorage.
   */
  getCurrentUser(): any | null {
    const userString = localStorage.getItem(this.USER_KEY);
    if (!userString) return null;
    try {
      return JSON.parse(userString);
    } catch (e) {
      this.logout();
      return null;
    }
  }
  /**
   * Actualiza los datos del usuario en localStorage.
   */
  updateUser(updatedData: any): Observable<any> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return of(null);
    }
    const updatedUser = { ...currentUser, ...updatedData };
    localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
    console.log("AuthService: Usuario actualizado en localStorage", updatedUser);
    return of(updatedUser).pipe(delay(500));
  }
  /**
   * Revisa si el rol del usuario logueado es 'ADMIN'.
   * Usado por el AdminGuard.
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user && user.role === 'ADMIN'; 
  }
}