import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Importamos HttpHeaders
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLE_KEY = 'user_role';
  private readonly USER_KEY = 'auth_user';
  
  // URL específica para Auth (Login/Register)
  private readonly API_URL = 'http://localhost:8080/api/v1/auth';
  
  // NUEVA: URL base para otros recursos (como Usuarios)
  private readonly BASE_API_URL = 'http://localhost:8080/api/v1';

  private loggedInStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  public loggedIn$ = this.loggedInStatus.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  /**
   * Realiza el login contra el Backend Spring Boot.
   */
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
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
    return this.http.post<any>(`${this.API_URL}/register`, userData).pipe(
      tap(response => {
         console.log('Usuario registrado:', response);
      })
    );
  }

  /**
   * NUEVO MÉTODO: Obtiene el perfil completo del usuario desde la BD.
   * Se usa para recuperar datos faltantes (DNI, Celular) que no estén en el localStorage.
   */
  getCompleteUserProfile(id: number): Observable<any> {
    const token = this.getToken();
    // Preparamos el header con el token para que Spring Security nos deje pasar
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Llamamos al endpoint GET /usuarios/{id} definido en tu UsuarioController
    return this.http.get<any>(`${this.BASE_API_URL}/usuarios/${id}`, { headers });
  }

  /**
   * Guarda la sesión completa en localStorage y notifica a la app.
   */
  private setSession(response: any): void {
    if (response && response.token) { 
      localStorage.setItem(this.TOKEN_KEY, response.token);
      
      if (response.role) {
        localStorage.setItem(this.ROLE_KEY, response.role);
      }

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
   * Actualiza los datos del usuario localmente.
   */
  updateUser(updatedData: any): Observable<any> {
    const currentUser = this.getCurrentUser();
    // Obtenemos el ID de manera segura
    const userId = currentUser.id || currentUser.idUsuario || currentUser.id_usuario;

    if (!userId) {
        console.error("No se encontró ID de usuario para actualizar");
        return of(null);
    }
    
    // NOTA: Aquí no mapeamos todavía, asumimos que 'updatedData' ya viene 
    // con los nombres de campos que espera Java (nombres, apellidos, etc.)
    // O lo mapeamos en el componente. Lo haremos en el componente para ser más claros.

    return this.http.put(`${this.BASE_API_URL}/usuarios/${userId}`, updatedData).pipe(
      tap((response: any) => {
        console.log("Usuario actualizado en BD:", response);
        
        // Actualizamos el localStorage con la respuesta del servidor
        // Mapeamos la respuesta de Java (nombres) a Angular (firstName) para la sesión local
        const userForLocal = {
            ...currentUser,
            firstName: response.nombres,
            lastName: response.apellidos,
            phone: response.celular,
            email: response.email || response.correo
        };
        
        localStorage.setItem(this.USER_KEY, JSON.stringify(userForLocal));
      })
    );
  }
  /**
   * Verifica si el usuario es administrador.
   */
  isAdmin(): boolean {
    const role = localStorage.getItem(this.ROLE_KEY);
    return role === 'ADMINISTRADOR'; 
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const currentUser = this.getCurrentUser();
    const userId = currentUser.id || currentUser.idUsuario;

    if (!userId) return throwError(() => 'No hay usuario logueado');

    const payload = {
      currentPassword: currentPassword,
      newPassword: newPassword
    };

    return this.http.put(`${this.BASE_API_URL}/usuarios/${userId}/cambiar-password`, payload);
  }
}