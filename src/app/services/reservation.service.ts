import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Reservation {
  location: any;
  service: any;
  barber: any;
  date: Date | null;
  time: string | null;
  user: any;
  confirmationNumber: string;
  status: 'upcoming' | 'completed' | 'canceled';
  id?: number; 
}

export type ReservationData = Omit<Reservation, 'status'>;

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly RESERVATION_KEY = 'user_reservations';
  private readonly API_URL = 'http://localhost:8080/api/v1/citas';

  public reservationsSubject = new BehaviorSubject<Reservation[]>([]);
  public reservations$: Observable<Reservation[]>;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.reservations$ = this.reservationsSubject.asObservable();
  }

  // --- CARGAR RESERVAS (CORREGIDO: Lee la sede real de la BD) ---
  public loadReservationsFromBackend(): void {
    const user = this.authService.getCurrentUser();
    const userId = user?.id || user?.idUsuario;

    if (!userId) {
      console.warn("No hay usuario logueado para cargar reservas.");
      return;
    }

    this.http.get<any[]>(`${this.API_URL}/usuario/${userId}`).pipe(
      map(citasJava => {
        return citasJava.map(cita => ({
          id: cita.idCita,
          date: new Date(cita.fecha + 'T00:00:00'), 
          time: cita.hora,
          confirmationNumber: cita.codigoConfirmacion,
          status: this.mapStatus(cita.estado),
          
          service: {
            id: cita.servicio.idServicio,
            name: cita.servicio.nombre,
            price: cita.servicio.precio
          },
          barber: {
            id: cita.barbero.idBarbero,
            name: cita.barbero.nombre
          },
          // CORRECCIÓN: Mapeo dinámico de la Sede real
          location: {
            id: cita.sede ? cita.sede.idSede : 0,
            // Ajusta 'nombre' o 'name' según como se llame en tu entidad Java Sede
            name: cita.sede ? (cita.sede.nombre || cita.sede.name) : 'Sede no especificada', 
            address: cita.sede ? (cita.sede.direccion || cita.sede.address) : '' 
          },
          user: user
        } as Reservation));
      })
    ).subscribe({
      next: (reservations) => {
        console.log("Reservas cargadas desde BD:", reservations);
        this.reservationsSubject.next(reservations);
        localStorage.setItem(this.RESERVATION_KEY, JSON.stringify(reservations));
      },
      error: (err) => console.error("Error cargando historial", err)
    });
  }

  private mapStatus(javaStatus: string): 'upcoming' | 'completed' | 'canceled' {
    if (javaStatus === 'CANCELADO') return 'canceled';
    if (javaStatus === 'ATENDIDO') return 'completed';
    return 'upcoming'; 
  }

  public getReservations(): Observable<Reservation[]> {
    return this.reservations$;
  }

  // --- CREAR RESERVA (CORREGIDO: Validación de Sede) ---
  public createReservation(newReservationData: ReservationData): void {
    const currentUser = this.authService.getCurrentUser();
    const dateObj = new Date(newReservationData.date!);
    const formattedDate = dateObj.toISOString().split('T')[0];

    // Validación de seguridad: La sede es obligatoria
    if (!newReservationData.location || !newReservationData.location.id) {
        console.error("Error crítico: Intentando enviar cita sin ID de Sede.");
        alert("Error: Por favor selecciona una sede válida.");
        return;
    }

    const payload = {
      date: formattedDate,
      time: newReservationData.time,
      confirmationNumber: newReservationData.confirmationNumber,
      barber: { id: newReservationData.barber.id },
      service: { id: newReservationData.service.id },
      location: { id: newReservationData.location.id }, // ID validado
      user: {
        id: currentUser?.id || currentUser?.id_usuario || 0,
        firstName: newReservationData.user.firstName,
        lastName: newReservationData.user.lastName,
        dni: newReservationData.user.dni,
        email: newReservationData.user.email,
        phone: newReservationData.user.phone
      }
    };

    this.http.post(this.API_URL, payload).subscribe({
      next: () => {
        console.log("Cita creada correctamente. Actualizando lista...");
        this.loadReservationsFromBackend(); 
      },
      error: (err) => {
        console.error("Error guardando cita en Backend:", err);
        // Aquí podrías mostrar un mensaje al usuario si falla
      }
    });
  }

  public cancelReservation(confirmationId: string): void {
    console.log('Cancelando reserva:', confirmationId);

    this.http.put(`${this.API_URL}/cancelar/${confirmationId}`, {}).subscribe({
      next: () => {
        console.log("Reserva cancelada en BD.");
        this.loadReservationsFromBackend();
      },
      error: (err) => console.error("Error al cancelar reserva", err)
    });
     
     // Actualización optimista local
     const current = this.reservationsSubject.value;
     const updated = current.map(r => 
        r.confirmationNumber === confirmationId ? { ...r, status: 'canceled' as const } : r
     );
     this.reservationsSubject.next(updated);
  }

  // --- ADMIN: Listar todas ---
  getAllReservationsAdmin(): Observable<Reservation[]> {
      return this.http.get<any[]>(this.API_URL).pipe(
        map(javaCitas => {
          return javaCitas.map(cita => ({
            id: cita.idCita,
            date: new Date(cita.fecha + 'T00:00:00'),
            time: cita.hora,
            confirmationNumber: cita.codigoConfirmacion,
            status: this.mapStatus(cita.estado),
            
            service: {
              name: cita.servicio ? (cita.servicio.nombre || cita.servicio.name) : 'Servicio no esp.',
              price: cita.servicio ? cita.servicio.precio : 0
            },
            barber: {
              name: cita.barbero ? (cita.barbero.nombre || cita.barbero.name) : 'Cualquiera'
            },
            location: {
              name: cita.sede ? (cita.sede.nombre || cita.sede.name) : 'Sede no encontrada' 
            },
            user: {
              firstName: cita.cliente?.nombres || 'Cliente',
              lastName: cita.cliente?.apellidos || 'Desconocido',
              email: cita.cliente?.correo || ''
            }
          } as Reservation));
        })
      );
    }
}