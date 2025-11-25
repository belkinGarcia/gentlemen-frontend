import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // 1. Importar HttpClient
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators'; // 2. Importar operadores
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLE_KEY = 'user_role';
  private readonly USER_KEY = 'auth_user';
  
  // 3. Define la URL de tu backend
  private readonly API_URL = 'http://localhost:8080/api/v1/auth';

  private loggedInStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  public loggedIn$ = this.loggedInStatus.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient // 4. Inyectar HttpClient
  ) {}

  /**
   * Realiza el login contra el Backend Spring Boot.
   */
  login(credentials: any): Observable<any> {
    // El backend espera { username: "...", password: "..." }
    return this.http.post<any>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        // Si el backend responde OK, guardamos la sesión
        console.log('Respuesta del Backend:', response);
        this.setSession(response);
      }),
      catchError(error => {
        console.error('Error en login:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Registra un nuevo usuario en el Backend.
   */
  register(userData: any): Observable<any> {
    // Nota: Asegúrate de tener este endpoint creado en tu AuthController de Java
    // Si no lo tienes aún, el login funcionará pero el registro dará error 404.
    return this.http.post<any>(`${this.API_URL}/register`, userData).pipe(
      tap(response => {
         // Opcional: Podrías hacer login automático aquí si el backend devuelve token
         console.log('Usuario registrado:', response);
      })
    );
  }

  /**
   * Guarda la sesión completa en localStorage y notifica a la app.
   */
  private setSession(response: any): void {
    if (response && response.token) { 
      localStorage.setItem(this.TOKEN_KEY, response.token);
      
      // Guardar el rol (Viene como "ADMINISTRADOR" o "CLIENTE" desde Java)
      if (response.role) {
        localStorage.setItem(this.ROLE_KEY, response.role);
      }

      // Guardar datos del usuario
      if (response.user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
      }
      
      this.loggedInStatus.next(true);
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

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    // Aquí podrías agregar lógica extra para validar si el token expiró (usando jwt-decode)
    return !!token;
  }

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
   * Actualiza los datos del usuario.
   * NOTA: Actualmente solo actualiza localStorage.
   * Para ser persistente, deberías crear un endpoint PUT /api/v1/usuarios en Java.
   */
  updateUser(updatedData: any): Observable<any> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return of(null);
    }
    
    // Fusionar datos actuales con los nuevos
    const updatedUser = { ...currentUser, ...updatedData };
    
    // Actualizar localStorage
    localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
    console.log("AuthService: Usuario actualizado localmente", updatedUser);
    
    // Retornamos un Observable inmediato (sin delay)
    return of(updatedUser);
  }

  /**
   * Verifica si el usuario es administrador.
   * Ajustado para coincidir con el Enum de Java: 'ADMINISTRADOR'
   */
  isAdmin(): boolean {
    const role = localStorage.getItem(this.ROLE_KEY);
    // Tu backend devuelve "ADMINISTRADOR", así que validamos eso.
    return role === 'ADMINISTRADOR'; 
  }
}