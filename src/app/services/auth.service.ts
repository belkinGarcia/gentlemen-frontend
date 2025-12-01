import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  // URL específica para Auth (asegúrate de que coincida con tu Controller)
  private readonly API_URL = 'http://localhost:8080/api/v1/usuarios'; // Ajustado al controller que vimos antes
  private readonly BASE_API_URL = 'http://localhost:8080/api/v1';

  private loggedInStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  public loggedIn$ = this.loggedInStatus.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  login(credentials: any): Observable<any> {
    // Usamos el endpoint /login que creamos en el UsuarioController
    return this.http.post<any>(`${this.API_URL}/login`, credentials).pipe(
      tap(usuario => {
        console.log('Login exitoso (Backend):', usuario);
        this.setSession(usuario);
      }),
      catchError(error => {
        console.error('Error en login:', error);
        return throwError(() => error);
      })
    );
  }

  register(userData: any): Observable<any> {
    // El backend usa POST /api/v1/usuarios para crear
    return this.http.post<any>(`${this.API_URL}`, userData).pipe(
      tap(response => {
         console.log('Usuario registrado:', response);
      })
    );
  }

  getCompleteUserProfile(id: number): Observable<any> {
    const token = this.getToken();
    // Enviamos el token aunque por ahora el backend lo ignore (útil para el futuro)
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.API_URL}/${id}`, { headers });
  }

  private setSession(usuario: any): void {
    if (usuario) {
      // 1. Guardar el usuario completo
      localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));

      // 2. Guardar el ROL (usando la propiedad correcta de Java: tipoUsuario)
      if (usuario.tipoUsuario) {
        localStorage.setItem(this.ROLE_KEY, usuario.tipoUsuario);
      }

      // 3. Simular Token (IMPORTANTE): Como el backend no manda JWT todavía,
      // creamos un token ficticio para que isLoggedIn() devuelva true y los Guards funcionen.
      // Cuando implementes JWT real en Java, usa usuario.token aquí.
      const fakeToken = 'session-token-' + usuario.idUsuario;
      localStorage.setItem(this.TOKEN_KEY, fakeToken);

      this.loggedInStatus.next(true);
    }
  }

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

  updateUser(updatedData: any): Observable<any> {
    const currentUser = this.getCurrentUser();
    const userId = currentUser.idUsuario || currentUser.id;

    if (!userId) {
        console.error("No ID de usuario para actualizar");
        return of(null);
    }

    return this.http.put(`${this.API_URL}/${userId}`, updatedData).pipe(
      tap((response: any) => {
        console.log("Usuario actualizado:", response);

        const userForLocal = {
            ...currentUser,
            ...response
        };

        localStorage.setItem(this.USER_KEY, JSON.stringify(userForLocal));
      })
    );
  }

  isAdmin(): boolean {
    const role = localStorage.getItem(this.ROLE_KEY);
    return role === 'ADMINISTRADOR';
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const currentUser = this.getCurrentUser();
    const userId = currentUser.idUsuario || currentUser.id;

    if (!userId) return throwError(() => 'No hay usuario logueado');

    const payload = {
      currentPassword: currentPassword,
      newPassword: newPassword
    };

    return this.http.put(`${this.API_URL}/${userId}/cambiar-password`, payload);
  }
}
