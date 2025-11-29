import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { LocationService } from './location.service';

// Actualizamos la interfaz para que coincida exactamente con tu nuevo Java
export interface WorkSchedule {
  day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
  hours: string[]; // Ahora es un array de strings directo desde el backend
}

export interface Barber {
  id: number;
  name: string;
  locationId: number;
  rating: number;
  imageUrl: string;
  bio: string;
  isActive: boolean;
  workSchedule?: WorkSchedule[];
  dayOff: string;
  shift: string;
}

@Injectable({
  providedIn: 'root'
})
export class BarberService {
  private readonly API_URL = 'http://localhost:8080/api/v1/barberos';

  private barbersSubject = new BehaviorSubject<Barber[]>([]);
  public barbers$: Observable<Barber[]> = this.barbersSubject.asObservable();

  constructor(
    private http: HttpClient,
    private locationService: LocationService
  ) {
    this.loadAllBarbers();
  }

  private loadAllBarbers(): void {
    this.http.get<any[]>(this.API_URL).pipe(
      map(backendBarbers => backendBarbers.map(b => this.mapBackendToFrontend(b)))
    ).subscribe({
      next: (barbers) => {
        this.barbersSubject.next(barbers);
      },
      error: (err) => console.error('Error cargando barberos:', err)
    });
  }

  /**
   * Mapeo de datos Backend -> Frontend
   */
  private mapBackendToFrontend(backendBarber: any): Barber {
    return {
      id: backendBarber.id,
      name: backendBarber.name,
      // Extracción segura del ID de la sede
      locationId: backendBarber.locationId ? (backendBarber.locationId.id || backendBarber.locationId.idSede) : 0,
      rating: backendBarber.rating,
      imageUrl: backendBarber.imageUrl,
      bio: backendBarber.bio,
      isActive: backendBarber.isActive,
      // Aquí ya no transformamos nada, tomamos el array tal cual viene del backend
      workSchedule: backendBarber.workSchedule,
      dayOff: backendBarber.dayOff,
      shift: backendBarber.shift
    };
  }

  getBarbersByLocationId(locationId: number, includeInactive: boolean = false): Barber[] {
    return this.barbersSubject.getValue().filter(b =>
      b.locationId === locationId && (includeInactive || b.isActive)
    );
  }

  getBarbersWithLocationName(includeInactive: boolean = false): (Barber & { locationName: string })[] {
    const allBarbers = this.barbersSubject.getValue().filter(b => (includeInactive || b.isActive));
    return allBarbers.map(barber => {
      const location = this.locationService.getLocationById(barber.locationId);
      return {
        ...barber,
        locationName: location ? location.name : 'Sede Desconocida'
      };
    });
  }

  getBarberById(id: number): Barber | undefined {
    return this.barbersSubject.getValue().find(b => b.id === id);
  }

  createBarber(barber: Omit<Barber, 'id'>): void {
    const payload = {
      ...barber,
      locationId: { id: barber.locationId }
    };

    this.http.post<any>(this.API_URL, payload).subscribe({
      next: (newBarberBackend) => {
        const newBarber = this.mapBackendToFrontend(newBarberBackend);
        const currentBarbers = this.barbersSubject.getValue();
        this.barbersSubject.next([...currentBarbers, newBarber]);
      },
      error: (e) => console.error('Error creando barbero', e)
    });
  }

  updateBarber(updatedBarber: Barber): void {
    const payload = {
      ...updatedBarber,
      locationId: { id: updatedBarber.locationId }
    };

    this.http.put<any>(`${this.API_URL}/${updatedBarber.id}`, payload).subscribe({
      next: (responseBarber) => {
        const mappedBarber = this.mapBackendToFrontend(responseBarber);
        const currentBarbers = this.barbersSubject.getValue();
        const updatedList = currentBarbers.map(b =>
          b.id === mappedBarber.id ? mappedBarber : b
        );
        this.barbersSubject.next(updatedList);
      },
      error: (e) => console.error('Error actualizando barbero', e)
    });
  }

  deleteBarber(id: number): void {
    this.http.delete(`${this.API_URL}/${id}`).subscribe({
      next: () => {
        const currentBarbers = this.barbersSubject.getValue();
        const updatedList = currentBarbers.filter(b => b.id !== id);
        this.barbersSubject.next(updatedList);
      },
      error: (e) => console.error('Error eliminando barbero', e)
    });
  }

  // --- LÓGICA DE HORARIOS ---

  // Ahora es directo: simplemente buscamos el día y devolvemos las horas que ya vienen calculadas
  getFixedHoursForDay(barberId: number, dayName: string): string[] {
      const barber = this.getBarberById(barberId);
      if (!barber || !barber.workSchedule) return [];

      const daySchedule = barber.workSchedule.find((s: any) => s.day === dayName);

      // Si existe el horario, devolvemos el array 'hours' directamente
      return daySchedule ? daySchedule.hours : [];
  }

  saveBarberWorkSchedule(barberId: number, newSchedule: WorkSchedule[]): void {
    const barber = this.getBarberById(barberId);
    if(barber) {
      const updatedBarber = { ...barber, workSchedule: newSchedule };
      this.updateBarber(updatedBarber);
    }
  }
}
