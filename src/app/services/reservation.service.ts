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
          date: new Date(cita.fecha + 'T00:00:00.000'), 
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
    
    // 1. Formato de fecha corregido (YYYY-MM-DD)
    const dateObj = new Date(newReservationData.date!);
    const formattedDate = dateObj.toISOString().split('T')[0];

    // 2. Validación de seguridad
    if (!newReservationData.location || !newReservationData.location.id) {
        alert("Error: Por favor selecciona una sede válida.");
        return;
    }

    // 3. Obtener el ID del usuario de forma segura
    const userId = currentUser?.id || currentUser?.idUsuario || currentUser?.id_usuario;

    // 4. PAYLOAD CORREGIDO PARA JAVA
    // Usamos los nombres exactos de las relaciones en Cita.java (cliente, barbero, servicio, sede)
    // Y usamos los nombres exactos de los IDs (idUsuario, idBarbero, idServicio, idSede)
    const payload = {
      fecha: formattedDate,          // Java: fecha
      hora: newReservationData.time, // Java: hora
      codigoConfirmacion: newReservationData.confirmationNumber, // Java: codigoConfirmacion
      estado: 'POR_ATENDER',         // Java: estado (Es bueno enviarlo explícito)
      
      // RELACIONES (Solo enviamos el ID para evitar errores de deserialización)
      cliente: { 
        idUsuario: userId 
      },
      barbero: { 
        idBarbero: newReservationData.barber.id // Asegúrate que en el front 'id' tenga el valor correcto
      },
      servicio: { 
        idServicio: newReservationData.service.id 
      },
      sede: { 
        idSede: newReservationData.location.id 
      }
    };

    console.log("Enviando JSON a Java:", payload); // Para depurar

    this.http.post(this.API_URL, payload).subscribe({
      next: () => {
        console.log("Cita creada correctamente.");
        this.loadReservationsFromBackend(); 
      },
      error: (err) => {
        console.error("Error guardando cita en Backend:", err);
        // Tip: Si sale error 500, mira la consola de Java (STS)
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