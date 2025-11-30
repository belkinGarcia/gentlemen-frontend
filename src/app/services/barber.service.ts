import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { LocationService } from './location.service';

export interface WorkSchedule {
  day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
  hours: string[]; 
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

  public loadAllBarbers(): void {
    this.http.get<any[]>(this.API_URL).pipe(
      map(backendBarbers => backendBarbers.map(b => this.mapBackendToFrontend(b)))
    ).subscribe({
      next: (barbers) => {
        this.barbersSubject.next(barbers);
      },
      error: (err) => console.error('Error cargando barberos:', err)
    });
  }

  // --- MAPEO BACKEND -> FRONTEND ---
  private mapBackendToFrontend(backendBarber: any): Barber {
    const formatDayName = (dbDay: string): any => {
      const map: { [key: string]: string } = {
        'LUNES': 'Lunes', 'MARTES': 'Martes', 'MIERCOLES': 'Miércoles',
        'JUEVES': 'Jueves', 'VIERNES': 'Viernes', 'SABADO': 'Sábado',
        'DOMINGO': 'Domingo', 'NINGUNO': 'Ninguno'
      };
      return map[dbDay] || dbDay;
    };

    const formattedSchedule = backendBarber.workSchedule 
      ? backendBarber.workSchedule.map((ws: any) => ({
          hours: ws.hours,
          day: formatDayName(ws.day)
        }))
      : [];

    return {
      id: backendBarber.id,
      name: backendBarber.name,
      locationId: backendBarber.locationId ? (backendBarber.locationId.id || backendBarber.locationId.idSede) : 0,
      rating: backendBarber.rating,
      imageUrl: backendBarber.imageUrl,
      bio: backendBarber.bio,
      isActive: backendBarber.isActive,
      workSchedule: formattedSchedule,
      dayOff: formatDayName(backendBarber.dayOff),
      shift: backendBarber.shift
    };
  }

  // --- MAPEO FRONTEND -> BACKEND ---
  private mapFrontendToBackend(frontendBarber: any): any {
    
    const translateDay = (uiDay: string): string => {
      const map: { [key: string]: string } = {
        'Lunes': 'LUNES', 'Martes': 'MARTES', 'Miércoles': 'MIERCOLES',
        'Jueves': 'JUEVES', 'Viernes': 'VIERNES', 'Sábado': 'SABADO',
        'Domingo': 'DOMINGO', 'Ninguno': 'NINGUNO'
      };
      return map[uiDay] || uiDay.toUpperCase();
    };

    const translateShift = (uiShift: string): string => {
      const map: { [key: string]: string } = {
        'Full Time': 'FULL_TIME',
        'Part Time - Mañana': 'PART_TIME_MANANA',
        'Part Time - Tarde': 'PART_TIME_TARDE'
      };
      return map[uiShift] || uiShift;
    };

    let backendSchedule;

    // LÓGICA HÍBRIDA IMPORTANTE:
    // 1. Si el frontend envía un horario manual (length > 0), RESPETAMOS ese horario.
    // 2. Si el frontend NO envía horario (es nuevo o vacío), GENERAMOS uno automático basado en el turno.
    
    if (frontendBarber.workSchedule && frontendBarber.workSchedule.length > 0) {
        // Opción 1: Traducir el horario manual existente
        backendSchedule = frontendBarber.workSchedule.map((ws: any) => ({
            hours: ws.hours,
            day: translateDay(ws.day)
        }));
    } else {
        // Opción 2: Generar automático (para nuevos barberos)
        const generatedSchedule = this.generateScheduleForShift(
            frontendBarber.shift, 
            frontendBarber.dayOff
        );
        backendSchedule = generatedSchedule.map(ws => ({
            hours: ws.hours,
            day: translateDay(ws.day)
        }));
    }

    return {
      ...frontendBarber,
      locationId: { id: frontendBarber.locationId },
      dayOff: translateDay(frontendBarber.dayOff),
      shift: translateShift(frontendBarber.shift),
      workSchedule: backendSchedule
    };
  }

  // --- GENERADOR DE HORARIOS ---
  private generateScheduleForShift(shift: string, dayOff: string): WorkSchedule[] {
    const days: any[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    let hours: string[] = [];

    if (shift === 'Full Time') {
      hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    } else if (shift === 'Part Time - Mañana') {
      hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'];
    } else if (shift === 'Part Time - Tarde') {
      hours = ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    }

    const schedule: WorkSchedule[] = [];
    days.forEach(day => {
      if (day !== dayOff) {
        schedule.push({ day: day, hours: [...hours] });
      }
    });
    return schedule;
  }

  // --- CRUD ---

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
    const payload = this.mapFrontendToBackend(barber);
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
    const payload = this.mapFrontendToBackend(updatedBarber);
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

  getFixedHoursForDay(barberId: number, dayName: string): string[] {
      const barber = this.getBarberById(barberId);
      if (!barber || !barber.workSchedule) return [];
      const daySchedule = barber.workSchedule.find((s: any) => s.day === dayName);
      return daySchedule ? daySchedule.hours : [];
  }

  // --- MÉTODO RESTAURADO PARA EL COMPONENTE DE GESTIÓN DE HORARIOS ---
  saveBarberWorkSchedule(barberId: number, newSchedule: WorkSchedule[]): void {
    const barber = this.getBarberById(barberId);
    if(barber) {
      // Al actualizar el objeto aquí y llamar a updateBarber,
      // la lógica de mapFrontendToBackend verá que 'newSchedule' tiene datos
      // y los usará en lugar de generar el horario automático.
      const updatedBarber = { ...barber, workSchedule: newSchedule };
      this.updateBarber(updatedBarber);
    }
  }
}