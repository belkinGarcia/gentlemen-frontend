import { Injectable } from '@angular/core';
import { BarberService } from './barber.service';
import { ReservationService, Reservation } from './reservation.service';
import { Service } from './service.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  // TIEMPO DE LIMPIEZA / BREAK ENTRE CITAS (EN MINUTOS)
  private readonly BUFFER_TIME = 15; 

  constructor(
    private barberService: BarberService,
    private reservationService: ReservationService
  ) { }

  // Convierte "09:30" a minutos (570)
  private timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  // Convierte minutos (570) a "09:30"
  private minutesToTime(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  isDateUnavailable(date: Date): boolean {
    return false; 
  }

  getAvailableTimesFor(date: Date, barberId: number | null, appointmentDuration: number): string[] {
    if (!barberId) return [];

    const daysMap = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayName = daysMap[date.getDay()];

    // 1. Obtener el rango de trabajo del barbero (Inicio y Fin del turno)
    const workTimeSlots: string[] = this.barberService.getFixedHoursForDay(barberId, dayName);

    if (!workTimeSlots || workTimeSlots.length === 0) {
      return [];
    }

    // Asumimos que el primer elemento es la hora de entrada y el último es la última hora posible de cita
    // Nota: Si el turno acaba a las 20:00, la última cita no puede empezar a las 20:00 si dura 1h.
    // Usaremos el array para definir los LÍMITES del día.
    const shiftStartMinutes = this.timeToMinutes(workTimeSlots[0]);
    
    // Calculamos el final del turno. 
    // Si el array dice "20:00" como última hora, asumimos que cierra a las 21:00 o que esa es la última hora de inicio.
    // Para estar seguros, tomamos el último slot + 60 min como "Cierre de local" aproximado.
    const lastSlot = this.timeToMinutes(workTimeSlots[workTimeSlots.length - 1]);
    const shiftEndMinutes = lastSlot + 60; 

    // 2. Obtener Reservas Existentes de ese día
    const allReservations = this.reservationService.reservationsSubject.getValue();
    const existingReservations = allReservations.filter((res: Reservation) => 
      res.barber.id === barberId &&
      res.status === 'upcoming' &&
      res.date && new Date(res.date).toDateString() === date.toDateString()
    );

    // Ordenamos las reservas por hora para facilitar el salto
    existingReservations.sort((a, b) => this.timeToMinutes(a.time!) - this.timeToMinutes(b.time!));

    const availableSlots: string[] = [];
    
    // 3. ALGORITMO DE GENERACIÓN DE SLOTS SECUENCIALES
    // Empezamos a iterar desde la hora de inicio del turno
    let currentPointer = shiftStartMinutes;

    while (currentPointer + appointmentDuration <= shiftEndMinutes) {
      
      const proposedEnd = currentPointer + appointmentDuration;
      let isCollision = false;
      let nextAvailableStart = currentPointer;

      // Verificamos colisión con reservas existentes
      for (const res of existingReservations) {
        if (!res.time) continue;

        const resStart = this.timeToMinutes(res.time);
        const resDuration = (res.service as Service).duration || 30;
        // La reserva existente también necesita su propio buffer de salida
        const resEnd = resStart + resDuration + this.BUFFER_TIME; 

        // Lógica de Choque:
        // (Mi inicio es antes de que termine la reserva) Y (Mi final es después de que inicie la reserva)
        // Agregamos un pequeño margen de seguridad
        if (currentPointer < resEnd && proposedEnd > resStart) {
          isCollision = true;
          // Si chocamos, NO sirve este horario.
          // El próximo intento debe ser CUANDO TERMINE esta reserva + Buffer
          nextAvailableStart = resEnd; 
          break; // Salimos del for de reservas porque ya chocamos con una
        }
      }

      if (isCollision) {
        // Si hubo choque, saltamos el puntero hasta después de la reserva que estorbaba
        currentPointer = nextAvailableStart;
      } else {
        // SI ES VÁLIDO:
        // 1. Agregamos la hora a la lista
        availableSlots.push(this.minutesToTime(currentPointer));

        // 2. Avanzamos el puntero: Duración del servicio + Buffer de limpieza
        currentPointer += appointmentDuration + this.BUFFER_TIME;
      }
    }

    return availableSlots;
  }
}