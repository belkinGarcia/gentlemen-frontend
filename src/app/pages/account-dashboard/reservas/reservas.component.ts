// src/app/pages/account-dashboard/reservas/reservas.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { ReservationService, Reservation } from '../../../services/reservation.service';
import { Subscription } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { BookingComponent } from '../../../components/booking/booking.component'; // Ajusta la ruta

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule
  ],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit, OnDestroy {

  allReservations: Reservation[] = [];
  upcomingReservations: Reservation[] = [];
  pastReservations: Reservation[] = [];

  private reservationSub: Subscription | undefined;

  constructor(
    private reservationService: ReservationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.reservationSub = this.reservationService.getReservations().subscribe(reservations => {
      this.allReservations = reservations;
      this.filterReservations();
    });
  }

  ngOnDestroy(): void {
    this.reservationSub?.unsubscribe();
  }

  filterReservations(): void {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Primero, simulamos las citas completadas
    const simulatedReservations = this.allReservations.map(res => {
      // Si una cita "upcoming" ya pasó, márcala como "completed"
      if (res.status === 'upcoming' && res.date && new Date(res.date) < startOfToday) {
        // Devolvemos un nuevo objeto con el estado correcto
        return { ...res, status: 'completed' as const }; 
      }
      return res;
    });

    this.upcomingReservations = simulatedReservations.filter(
      r => r.status === 'upcoming'
    );
    
    this.pastReservations = simulatedReservations.filter(
      r => r.status === 'completed' || r.status === 'canceled'
    );
  }

  cancelReservation(confirmationId: string): void {
    this.reservationService.cancelReservation(confirmationId);
  }

  reschedule(reservation: Reservation): void {
    console.log("Reagendando:", reservation);
    
    // Abre el modal de Booking, igual que lo hace el Header
    this.dialog.open(BookingComponent, {
      width: '90%',
      maxWidth: '1200px',
      data: {
        isReschedule: true,
        reservationData: reservation // <-- Pasa los datos de la cita
      }
    });
  }

  // Helper para el chip
  getStatusChip(status: 'upcoming' | 'completed' | 'canceled'): string {
    switch (status) {
      case 'completed': return 'Finalizada';
      case 'canceled': return 'Cancelada';
      default: return 'Próxima';
    }
  }

  // Helper para el color del chip
  getStatusColor(status: 'upcoming' | 'completed' | 'canceled'): 'primary' | 'warn' | 'accent' {
    switch (status) {
      case 'completed': return 'accent';
      case 'canceled': return 'warn';
      default: return 'primary';
    }
  }
}