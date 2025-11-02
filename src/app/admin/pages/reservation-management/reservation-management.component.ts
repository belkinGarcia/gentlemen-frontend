// src/app/admin/pages/reservation-management/reservation-management.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { ReservationService, Reservation } from '../../../services/reservation.service'; // Ajusta la ruta (../..)

@Component({
  selector: 'app-reservation-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './reservation-management.component.html',
  styleUrls: ['./reservation-management.component.css']
})
export class ReservationManagementComponent implements OnInit, OnDestroy {

  // Columnas que mostraremos en la tabla de admin
  displayedColumns: string[] = ['status', 'dateTime', 'client', 'service', 'barber', 'location', 'actions'];
  dataSource: Reservation[] = [];
  private reservationSub: Subscription | undefined;

  constructor(
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    // Nos suscribimos al servicio para obtener TODAS las reservas
    this.reservationSub = this.reservationService.getReservations().subscribe(reservations => {
      // Ordenamos por fecha, las más nuevas primero
      this.dataSource = reservations.sort((a, b) => 
        new Date(b.date!).getTime() - new Date(a.date!).getTime()
      );
    });
  }

  ngOnDestroy(): void {
    this.reservationSub?.unsubscribe();
  }

  // Función para cancelar la reserva (el admin puede hacerlo)
  cancelReservation(reservation: Reservation): void {
    if (confirm(`¿Estás seguro de que quieres cancelar la cita de ${reservation.user.firstName}?`)) {
      this.reservationService.cancelReservation(reservation.confirmationNumber);
    }
  }

  // Helper para el color del chip (copiado de reservas.component.ts)
  getStatusColor(status: 'upcoming' | 'completed' | 'canceled'): 'primary' | 'warn' | 'accent' {
    switch (status) {
      case 'completed': return 'accent';
      case 'canceled': return 'warn';
      default: return 'primary';
    }
  }
}