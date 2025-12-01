import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReservationService, Reservation } from '../../../services/reservation.service';

@Component({
  selector: 'app-reservation-management',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatChipsModule, 
    MatIconModule, MatButtonModule, MatTooltipModule
  ],
  templateUrl: './reservation-management.component.html',
  styleUrls: ['./reservation-management.component.css']
})
export class ReservationManagementComponent implements OnInit {
  
  displayedColumns: string[] = ['status', 'dateTime', 'client', 'service', 'barber', 'location', 'actions'];
  dataSource: Reservation[] = [];

  constructor(
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.reservationService.getAllReservationsAdmin().subscribe({
      next: (reservations) => {
        // Ordenar: Las más recientes primero
        this.dataSource = reservations.sort((a, b) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return dateB - dateA;
        });
      },
      error: (err) => console.error("Error cargando citas admin:", err)
    });
  }

  cancelReservation(reservation: Reservation): void {
    if (confirm(`¿Estás seguro de que quieres cancelar la cita de ${reservation.user.firstName}?`)) {
      
      // 1. Llamada al servicio
      this.reservationService.cancelReservation(reservation.confirmationNumber);
      
      // 2. Actualización Optimista (Visual inmediata)
      // Cambiamos el estado localmente para que el usuario vea el cambio ya mismo
      const index = this.dataSource.indexOf(reservation);
      if (index >= 0) {
        // Creamos una copia del objeto para que Angular detecte el cambio en la tabla
        const updatedReservation = { ...reservation, status: 'canceled' as const };
        
        // Actualizamos el array
        const newDataSource = [...this.dataSource];
        newDataSource[index] = updatedReservation;
        this.dataSource = newDataSource;
      }

      // Opcional: Recargar desde el servidor después de 1 segundo para confirmar
      setTimeout(() => this.loadData(), 1000);
    }
  }

  // --- CORRECCIÓN 1: Typos y Colores ---
  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'accent'; // Verde o color secundario
      case 'canceled': return 'warn';    // Rojo (CORREGIDO: decía 'canceleda')
      case 'upcoming': return 'primary'; // Azul
      default: return 'primary';
    }
  }

  // --- MEJORA 2: Traducción al Español ---
  getStatusLabel(status: string): string {
    switch (status) {
      case 'completed': return 'Atendido';
      case 'canceled': return 'Cancelado';
      case 'upcoming': return 'Por Atender';
      default: return status;
    }
  }
}