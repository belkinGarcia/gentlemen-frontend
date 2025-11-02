import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // <-- Importa RouterModule
import { MatIconModule } from '@angular/material/icon'; // <-- Importa MatIconModule
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; // <-- Importa tu AuthService

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // <-- Añádelo a imports
    MatIconModule   // <-- Añádelo a imports
  ],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'] // <-- Necesitaremos crear este archivo
})
export class AdminLayoutComponent {

  // Inyecta el AuthService para usarlo en el botón de logout
  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout(); // Asumiendo que tu servicio tiene un método logout
    // El router te redirigirá automáticamente gracias al AuthGuard
  }
}