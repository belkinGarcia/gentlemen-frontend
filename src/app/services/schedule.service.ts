import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BarberService, Barber } from './barber.service';
import { ReservationService, Reservation } from './reservation.service'; 
import { Service } from './service.service';
const OPEN_HOURS_STRINGS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', 
  '16:00', '17:00', '18:00', '19:00'
];
@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  constructor(
    private barberService: BarberService,
    private reservationService: ReservationService 
  ) { }
  private timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }
  isDateUnavailable(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6;
  }
  /**
   * Obtiene los slots de tiempo disponibles.
   */
  getAvailableTimesFor(date: Date, barberId: number | null, appointmentDuration: number): string[] { 
    if (!barberId) return OPEN_HOURS_STRINGS;
    const barber = this.barberService.getBarberById(barberId);
    if (!barber) return [];
    const selectedDayName = date.toLocaleDateString('es-PE', { weekday: 'long' });
    const toTitleCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
    if (barber.dayOff && toTitleCase(barber.dayOff) === toTitleCase(selectedDayName)) {
      return [];
    }
    let workTimeSlots: string[];
    if (barber.shift === 'Full Time') {
      workTimeSlots = OPEN_HOURS_STRINGS;
    } else if (barber.shift === 'Part Time - Mañana') {
      workTimeSlots = OPEN_HOURS_STRINGS.slice(0, 6);
    } else if (barber.shift === 'Part Time - Tarde') {
      workTimeSlots = OPEN_HOURS_STRINGS.slice(6, 12);
    } else {
      workTimeSlots = [];
    }
    const allReservations = this.reservationService.reservationsSubject.getValue(); 
    const existingReservations = allReservations
      .filter((res: Reservation) => res.barber.id === barberId && 
                      res.status === 'upcoming' && 
                      new Date(res.date!).toDateString() === date.toDateString());
    const availableSlots: string[] = [];
    const baseIncrementMinutes = 10;
   for (const startTimeStr of workTimeSlots) {
        for (let minuteOffset = 0; minuteOffset < 60; minuteOffset += baseIncrementMinutes) { 
            const startMinutes = this.timeToMinutes(startTimeStr) + minuteOffset;
            const endMinutes = startMinutes + appointmentDuration;
            if (startMinutes % appointmentDuration !== 0) {
                continue;
            }
            const startHour = Math.floor(startMinutes / 60);
            const startMinute = startMinutes % 60;
            const finalStartTimeStr = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
            let isSlotAvailable = true;
            for (const res of existingReservations) {
                const resStartMinutes = this.timeToMinutes(res.time!);
                const resDuration = (res.service as Service).duration; 
                const resEndMinutes = resStartMinutes + resDuration;
                if (startMinutes < resEndMinutes && endMinutes > resStartMinutes) {
                    isSlotAvailable = false;
                    break;
                }
            }
            if (isSlotAvailable && endMinutes <= this.timeToMinutes('20:00')) {
                availableSlots.push(finalStartTimeStr);
            }
        }
    }
    const uniqueSlots = [...new Set(availableSlots)]; 
    return uniqueSlots;
  }
}