import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { ReservationService, Reservation } from '../../../services/reservation.service';
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
  displayedColumns: string[] = ['status', 'dateTime', 'client', 'service', 'barber', 'location', 'actions'];
  dataSource: Reservation[] = [];
  private reservationSub: Subscription | undefined;
  constructor(
    private reservationService: ReservationService
  ) {}
  ngOnInit(): void {
    this.reservationSub = this.reservationService.getReservations().subscribe(reservations => {
      this.dataSource = reservations.sort((a, b) => 
        new Date(b.date!).getTime() - new Date(a.date!).getTime()
      );
    });
  }
  ngOnDestroy(): void {
    this.reservationSub?.unsubscribe();
  }
  cancelReservation(reservation: Reservation): void {
    if (confirm(`¿Estás seguro de que quieres cancelar la cita de ${reservation.user.firstName}?`)) {
      this.reservationService.cancelReservation(reservation.confirmationNumber);
    }
  }
  getStatusColor(status: 'upcoming' | 'completed' | 'canceled'): 'primary' | 'warn' | 'accent' {
    switch (status) {
      case 'completed': return 'accent';
      case 'canceled': return 'warn';
      default: return 'primary';
    }
  }
}