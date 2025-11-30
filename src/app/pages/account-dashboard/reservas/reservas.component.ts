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
import { BookingComponent } from '../../../components/booking/booking.component';
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
  readonly MIN_HOURS_TO_MODIFY = 2;
  private reservationSub: Subscription | undefined;
  constructor(
    private reservationService: ReservationService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
      // 1. Pedimos al servicio que traiga los datos frescos del backend
      this.reservationService.loadReservationsFromBackend();

      // 2. Nos suscribimos para recibir los datos cuando lleguen
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
    const simulatedReservations = this.allReservations.map(res => {
      if (res.status === 'upcoming' && res.date && new Date(res.date) < startOfToday) {
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
    const mensajeAdvertencia = `
      ⚠️ IMPORTANTE: REAGENDAR CITA

      1. Estás a punto de modificar tu reserva actual.
      2. Se cancelará la cita actual (#${reservation.confirmationNumber}) y se creará una nueva.
      3. Podrás modificar la ubicación, servicio, barbero, fecha y hora desde cero.

      ¿Deseas continuar?`;
      
      if (confirm(mensajeAdvertencia)) {
      console.log("Reagendando:", reservation);
      
      this.dialog.open(BookingComponent, {
        width: '90%',
        maxWidth: '1200px',
        data: {
          isReschedule: true,
          reservationData: reservation
        }
      });
    }
  }
  getStatusChip(status: 'upcoming' | 'completed' | 'canceled'): string {
    switch (status) {
      case 'completed': return 'Finalizada';
      case 'canceled': return 'Cancelada';
      default: return 'Próxima';
    }
  }
  getStatusColor(status: 'upcoming' | 'completed' | 'canceled'): 'primary' | 'warn' | 'accent' {
    switch (status) {
      case 'completed': return 'accent';
      case 'canceled': return 'warn';
      default: return 'primary';
    }
  }
  canModify(reservation: Reservation): boolean {
    if (!reservation.date || !reservation.time) return false;

    // Combinar fecha y hora en un objeto Date
    // Asumimos formato time "HH:mm"
    const dateStr = new Date(reservation.date).toISOString().split('T')[0]; // "2025-12-16"
    const dateTimeStr = `${dateStr}T${reservation.time}:00`;
    
    const appointmentDate = new Date(dateTimeStr);
    const now = new Date();

    // Calculamos diferencia en milisegundos
    const diffMs = appointmentDate.getTime() - now.getTime();
    
    // Convertimos a horas (ms / 1000 / 60 / 60)
    const diffHours = diffMs / (1000 * 60 * 60);

    return diffHours >= this.MIN_HOURS_TO_MODIFY;
  }
}