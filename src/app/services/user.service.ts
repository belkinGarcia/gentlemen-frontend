import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

// --- Definimos la Interfaz de Usuario ---
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

// --- DATOS MOCKEADOS INICIALES ---
// (Simulamos que el admin ya existe y hay un usuario)
const MOCK_USER_LIST: User[] = [
  {
    id: 99,
    firstName: 'Admin',
    lastName: 'Principal',
    email: 'admin@admin.com',
    role: 'ADMIN'
  },
  {
    id: 1,
    firstName: 'Usuario',
    lastName: 'de Prueba',
    email: 'prueba@gmail.com',
    role: 'USER'
  }
];
// ---------------------------------

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly USER_DB_KEY = 'user_database';
  
  // Usamos un BehaviorSubject para que la lista sea reactiva
  private usersSubject = new BehaviorSubject<User[]>([]);
  
  constructor() {
    // Al iniciar, cargamos los datos de localStorage o los datos mock
    const usersFromStorage = localStorage.getItem(this.USER_DB_KEY);
    if (usersFromStorage) {
      this.usersSubject.next(JSON.parse(usersFromStorage));
    } else {
      localStorage.setItem(this.USER_DB_KEY, JSON.stringify(MOCK_USER_LIST));
      this.usersSubject.next(MOCK_USER_LIST);
    }
  }

  /**
   * Devuelve un observable con la lista de todos los usuarios.
   */
  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  /**
   * Actualiza el rol de un usuario en la "base de datos" (localStorage).
   */
  updateUserRole(userId: number, newRole: 'USER' | 'ADMIN'): void {
    const currentUsers = this.usersSubject.getValue();
    
    const updatedUsers = currentUsers.map(user => {
      if (user.id === userId) {
        return { ...user, role: newRole };
      }
      return user;
    });

    // Guardamos y notificamos
    localStorage.setItem(this.USER_DB_KEY, JSON.stringify(updatedUsers));
    this.usersSubject.next(updatedUsers);
    
    console.log(`UserService: Rol de usuario ${userId} actualizado a ${newRole}`);
  }
}