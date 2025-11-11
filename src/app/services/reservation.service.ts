import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
export interface Reservation {
  location: any;
  service: any;
  barber: any;
  date: Date | null;
  time: string | null;
  user: any;
  confirmationNumber: string;
  status: 'upcoming' | 'completed' | 'canceled';
}
export type ReservationData = Omit<Reservation, 'status'>;
@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly RESERVATION_KEY = 'user_reservations';
  public reservationsSubject = new BehaviorSubject<Reservation[]>(this.getReservationsFromStorage());
  public reservations$: Observable<Reservation[]>;
  constructor() { this.reservations$ = this.reservationsSubject.asObservable();}
  private getReservationsFromStorage(): Reservation[] {
    const reservationsString = localStorage.getItem(this.RESERVATION_KEY);
    if (!reservationsString) {
      return [];
    }
    try {
      return JSON.parse(reservationsString) as Reservation[];
    } catch (e) {
      console.error("Error al parsear reservas de localStorage", e);
      return [];
    }
  }
  public getReservations(): Observable<Reservation[]> {
    return this.reservations$;
  }
  public createReservation(newReservationData: ReservationData): void {
    const newReservation: Reservation = {
      ...newReservationData,
      status: 'upcoming'
    };
    const currentReservations = this.getReservationsFromStorage();
    const updatedReservations = [...currentReservations, newReservation];
    localStorage.setItem(this.RESERVATION_KEY, JSON.stringify(updatedReservations));
    this.reservationsSubject.next(updatedReservations);
    console.log("Reserva guardada en el servicio:", newReservation);
  }
  public cancelReservation(confirmationId: string): void {
    console.log('Servicio: Cancelando reserva:', confirmationId);
    const currentReservations = this.getReservationsFromStorage();
    const updatedReservations = currentReservations.map(res => {
      if (res.confirmationNumber === confirmationId) {
        return { ...res, status: 'canceled' as const }; 
      }
      return res;
    });
    localStorage.setItem(this.RESERVATION_KEY, JSON.stringify(updatedReservations));
    this.reservationsSubject.next(updatedReservations);
  }
}