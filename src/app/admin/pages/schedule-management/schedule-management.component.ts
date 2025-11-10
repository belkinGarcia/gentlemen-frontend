import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BarberService, Barber, WorkSchedule } from '../../../services/barber.service';
import { ReservationService, Reservation } from '../../../services/reservation.service';
import { ScheduleService } from '../../../services/schedule.service';
interface DaySchedule {
  day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
  hours: string[];
}
@Component({
  selector: 'app-schedule-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatTableModule
  ],
  templateUrl: './schedule-management.component.html',
  styleUrls: ['./schedule-management.component.css']
})
export class ScheduleManagementComponent implements OnInit, OnDestroy {
  barberId: number | null = null;
  barber: Barber | undefined;
  reservations: Reservation[] = [];
  selectedDate: Date = new Date();
  minDate: Date = new Date();
  public availableTimes: string[] = [];
  daysOfWeek: DaySchedule['day'][] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  timeSlots: string[] = [];
  workSchedule: DaySchedule[] = [];
  private dataSub: Subscription | undefined;
  private readonly DEFAULT_DURATION = 30;
  constructor(
    private route: ActivatedRoute,
    private barberService: BarberService,
    private reservationService: ReservationService,
    public scheduleService: ScheduleService
  ) {
    this.initializeTimeSlots();
  }
  ngOnInit(): void {
    this.workSchedule = this.daysOfWeek.map(day => ({ day, hours: [] }));
    this.route.paramMap.subscribe(params => {
      this.barberId = Number(params.get('id'));
      if (this.barberId) {
        this.barber = this.barberService.getBarberById(this.barberId);
        if (this.barber && this.barber.workSchedule) {
            this.workSchedule = this.barber.workSchedule as DaySchedule[];
        }
        this.dataSub = this.reservationService.getReservations().subscribe(reservations => {
          this.reservations = reservations.filter(r => r.barber.id === this.barberId && r.status === 'upcoming');
          this.loadScheduleData(this.selectedDate);
        });
      }
    });
  }
  ngOnDestroy(): void {
    this.dataSub?.unsubscribe();
  }
  private initializeTimeSlots(): void {
    for (let i = 0; i < 24; i++) {
      this.timeSlots.push(`${i.toString().padStart(2, '0')}:00`);
    }
  }
  public loadScheduleData(date: Date): void {
    this.selectedDate = date;
    const baseTimes = this.scheduleService.getAvailableTimesFor(date, this.barberId, this.DEFAULT_DURATION); 
    const occupiedTimes = this.reservations
      .filter(r => r.date && new Date(r.date).toDateString() === date.toDateString())
      .map(r => r.time);
    this.availableTimes = baseTimes.filter(time => !occupiedTimes.includes(time));
  }
  toggleWorkHour(day: DaySchedule['day'], time: string): void {
    const dayEntry = this.workSchedule.find(entry => entry.day === day);
    if (dayEntry) {
      const index = dayEntry.hours.indexOf(time);
      if (index > -1) {
        dayEntry.hours.splice(index, 1);
      } else {
        if (dayEntry.hours.length < 8) {
          dayEntry.hours.push(time);
        } else {
          alert("Máximo 8 horas de trabajo por día.");
        }
      }
      dayEntry.hours.sort();
    }
  }
  saveWorkSchedule(): void {
    if (!this.barberId) return;
    this.barberService.saveBarberWorkSchedule(this.barberId, this.workSchedule as WorkSchedule[]);
    alert('Horario de trabajo actualizado con éxito.');
  }
  public checkTimeBooked(time: string): boolean {
    const isBooked = this.reservations.some(r => 
      r.time === time && r.date && new Date(r.date).toDateString() === this.selectedDate.toDateString()
    );
    return isBooked;
  }
  isWorkHour(day: DaySchedule['day'], time: string): boolean {
    const dayEntry = this.workSchedule.find(entry => entry.day === day);
    return dayEntry ? dayEntry.hours.includes(time) : false;
  }
}