import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz corregida para coincidir con el Backend
export interface Usuario {
  idUsuario?: number;    // Java: idUsuario
  nombres: string;       // Java: nombres
  apellidos: string;     // Java: apellidos
  dni: string;           // Java: dni
  email: string;         // Java: email
  celular?: string;      // Java: celular
  contrasena?: string;   // Java: contrasena
  tipoUsuario: string;   // Java: tipoUsuario (CLIENTE o ADMINISTRADOR)
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // URL Corregida
  private apiUrl = 'http://localhost:8080/api/v1/usuarios';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, credentials);
  }

  register(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  getUsers(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  createUser(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  updateUser(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}