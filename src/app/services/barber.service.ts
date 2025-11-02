// src/app/services/barber.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocationService, Location } from './location.service';

// Interfaz (simulada) para el horario fijo semanal
export interface WorkSchedule {
  day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
  hours: string[];
}

// Interfaz (simulada) para un Barbero
export interface Barber {
  id: number;
  name: string;
  locationId: number;
  rating: number;
  imageUrl: string;
  bio: string;
  isActive: boolean;
  workSchedule?: WorkSchedule[]; 
  dayOff: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo' | 'Ninguno';
  shift: 'Full Time' | 'Part Time - Mañana' | 'Part Time - Tarde';
}

// Lista MOCK (Corregida con IDs únicos)
const MOCK_BARBERS: Barber[] = [
  { 
    id: 1, name: 'Javier Mendoza', locationId: 1, rating: 4.8, imageUrl: 'url-javier.jpg', bio: 'Especialista en cortes fade.', isActive: true, workSchedule: [],
    dayOff: 'Domingo', shift: 'Full Time' 
  },
  { 
    id: 2, name: 'Carlos Ruiz', locationId: 1, rating: 4.5, imageUrl: 'url-carlos.jpg', bio: 'El mejor en afeitados clásicos.', isActive: true, workSchedule: [],
    dayOff: 'Lunes', shift: 'Part Time - Tarde' 
  },
  { 
    id: 3, name: 'Luis Torres', locationId: 2, rating: 4.9, imageUrl: 'url-luis.jpg', bio: 'Maestro del cabello rizado.', isActive: true, workSchedule: [],
    dayOff: 'Ninguno', shift: 'Full Time'
  },
];

@Injectable({
  providedIn: 'root'
})
export class BarberService {

  private readonly BARBER_KEY = 'barber_database';
  
  private barbersSubject = new BehaviorSubject<Barber[]>([]);
  public barbers$: Observable<Barber[]> = this.barbersSubject.asObservable();

  constructor(private locationService: LocationService) {
    // Lógica para cargar desde localStorage
    const barbersFromStorage = localStorage.getItem(this.BARBER_KEY);
    if (barbersFromStorage) {
      this.barbersSubject.next(JSON.parse(barbersFromStorage));
    } else {
      localStorage.setItem(this.BARBER_KEY, JSON.stringify(MOCK_BARBERS));
      this.barbersSubject.next(MOCK_BARBERS);
    }
  }

  private _getBarbersFromStorage(): Barber[] {
    return JSON.parse(localStorage.getItem(this.BARBER_KEY) || '[]');
  }

  private _saveToStorage(barbers: Barber[]): void {
    localStorage.setItem(this.BARBER_KEY, JSON.stringify(barbers));
    this.barbersSubject.next(barbers);
  }

  // --- MÉTODOS DE LECTURA ---
  getBarbersByLocationId(locationId: number, includeInactive: boolean = false): Barber[] {
      return this.barbersSubject.getValue().filter(b => 
        b.locationId === locationId && (includeInactive || b.isActive)
      );
    }
  // Obtiene barberos con el nombre de la sede
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
  
  // --- MÉTODOS CRUD ---

  createBarber(barber: Omit<Barber, 'id'>): void {
    const currentBarbers = this._getBarbersFromStorage();
    const newId = Math.max(...currentBarbers.map(b => b.id), 0) + 1;
    const newBarber: Barber = { ...barber as Barber, id: newId, workSchedule: [] }; // Asegura el array de horario
    
    this._saveToStorage([...currentBarbers, newBarber]);
  }

  updateBarber(updatedBarber: Barber): void {
    const currentBarbers = this._getBarbersFromStorage();
    const updatedList = currentBarbers.map(b => 
      b.id === updatedBarber.id ? updatedBarber : b
    );
    this._saveToStorage(updatedList);
  }

  deleteBarber(id: number): void {
    const currentBarbers = this._getBarbersFromStorage();
    const updatedList = currentBarbers.filter(b => b.id !== id);
    this._saveToStorage(updatedList);
  }

  // --- HORARIOS ---
  saveBarberWorkSchedule(barberId: number, newSchedule: WorkSchedule[]): void {
    const currentBarbers = this._getBarbersFromStorage();

    const updatedList = currentBarbers.map(b => 
      b.id === barberId ? { ...b, workSchedule: newSchedule } : b 
    );

    this._saveToStorage(updatedList);
  }

  getFixedHoursForDay(barberId: number, dayName: string): string[] {
      const barber = this.getBarberById(barberId);
      if (!barber || !barber.workSchedule) return [];

      const daySchedule = barber.workSchedule.find((s: any) => s.day === dayName); 
      return daySchedule ? daySchedule.hours : [];
  }
}