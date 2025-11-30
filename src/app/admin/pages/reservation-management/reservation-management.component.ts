import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button'; // Faltaba este import para el botón
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip'; // Y este para el tooltip
import { Subscription } from 'rxjs';
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
export class ReservationManagementComponent implements OnInit { // Quitamos OnDestroy si no usamos suscripción persistente
  
  displayedColumns: string[] = ['status', 'dateTime', 'client', 'service', 'barber', 'location', 'actions'];
  dataSource: Reservation[] = [];

  constructor(
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // CAMBIO: Usamos el método específico de Admin
    this.reservationService.getAllReservationsAdmin().subscribe({
      next: (reservations) => {
        this.dataSource = reservations.sort((a, b) => 
          new Date(b.date!).getTime() - new Date(a.date!).getTime()
        );
      },
      error: (err) => console.error("Error cargando citas admin:", err)
    });
  }

  cancelReservation(reservation: Reservation): void {
    if (confirm(`¿Estás seguro de que quieres cancelar la cita de ${reservation.user.firstName}?`)) {
      // Usamos el servicio. Como cancelReservation no retorna Observable en tu versión actual,
      // asumimos que actualiza y recargamos manualmente tras un pequeño delay o modificando la lista local.
      
      this.reservationService.cancelReservation(reservation.confirmationNumber);
      
      // Truco visual rápido: Cambiar estado en la tabla localmente
      const index = this.dataSource.indexOf(reservation);
      if (index >= 0) {
        this.dataSource[index].status = 'canceled';
        // Forzamos actualización de tabla (Angular Material a veces requiere reasignar array)
        this.dataSource = [...this.dataSource];
      }
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'accent'; // APROBADO/ATENDIDO
      case 'canceled': return 'warn';
      default: return 'primary'; // UPCOMING/PENDIENTE
    }
  }
}