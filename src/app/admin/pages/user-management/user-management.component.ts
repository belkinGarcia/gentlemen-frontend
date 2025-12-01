import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // IMPORTANTE para *ngIf
import { MatTableModule } from '@angular/material/table'; // IMPORTANTE para la tabla
import { MatSelectModule } from '@angular/material/select'; // IMPORTANTE para el select
import { MatFormFieldModule } from '@angular/material/form-field'; // IMPORTANTE para el form-field
import { MatOptionModule } from '@angular/material/core'; // IMPORTANTE para mat-option
import { UserService, Usuario } from '../../../services/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true, // <--- ESTO ES LA CLAVE
  imports: [
    CommonModule,       // Soluciona NG8103 (*ngIf)
    MatTableModule,     // Soluciona NG8001 (mat-table, matColumnDef)
    MatSelectModule,    // Soluciona NG8001 (mat-select) y el error del $event.value
    MatFormFieldModule, // Soluciona NG8001 (mat-form-field)
    MatOptionModule     // Soluciona NG8001 (mat-option)
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: Usuario[] = [];
  
  // Objeto inicializado
  newUser: Usuario = {
    nombres: '',
    apellidos: '',
    dni: '',
    email: '',
    contrasena: '',
    celular: '',
    tipoUsuario: 'CLIENTE'
  };

  isEditing = false;
  editingId: number | null = null;
  errorMessage: string = '';
  currentAdminId: number = 0; 
  displayedColumns: string[] = ['name', 'email', 'role']; // Columnas de la tabla

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar usuarios.';
      }
    });
  }

  // Método para el select de cambio de rol
  onRoleChange(user: Usuario, newRole: string): void {
      if(!user.idUsuario) return;
      
      // Creamos una copia del usuario con el nuevo rol
      const updatedUser: Usuario = { ...user, tipoUsuario: newRole };
      
      this.userService.updateUser(user.idUsuario, updatedUser).subscribe({
          next: () => console.log('Rol actualizado a', newRole),
          error: (e) => console.error('Error actualizando rol', e)
      });
  }

  // ... Resto de métodos (onSubmit, resetForm, etc. si los necesitas)
  resetForm(): void {
    this.newUser = {
      nombres: '',
      apellidos: '',
      dni: '',
      email: '',
      contrasena: '',
      celular: '',
      tipoUsuario: 'CLIENTE'
    };
    this.isEditing = false;
    this.editingId = null;
  }
}