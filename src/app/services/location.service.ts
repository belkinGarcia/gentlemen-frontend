// src/app/services/location.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Location {
    id: number;
    name: string;
    address: string;
    imageUrl: string;
    mapLink: string;
    phone: string;
}

// Datos MOCK iniciales
const MOCK_LOCATIONS: Location[] = [
    { 
      id: 1, 
      name: 'La Molina', 
      address: 'Javier Prado Este 5295, La Molina, Lima.', 
      imageUrl: 'https://cdn.midjourney.com/c95cfb5e-cb50-48f9-808d-7dd4b36bcc78/0_2.png',
      mapLink: 'https://maps.app.goo.gl/tu_enlace_de_google_maps',
      phone: '+51987654321' 
    },
    { 
      id: 2, 
      name: 'Lince', 
      address: 'Av. jacson 2, Rimac, Lima.', 
      imageUrl: 'https://cdn.midjourney.com/3bc73fde-49ec-49cc-8bf2-c86a3083b5cd/0_3.png',
      mapLink: 'https://maps.app.goo.gl/tu_enlace_de_google_maps',
      phone: '+51912345678'
    },
];

@Injectable({
  providedIn: 'root'
})
export class LocationService {
    
    private readonly LOCATION_KEY = 'location_database';

    private locationsSubject = new BehaviorSubject<Location[]>([]);
    public locations$: Observable<Location[]> = this.locationsSubject.asObservable();
    
    constructor() {
        this.loadInitialData();
    }
    
    private loadInitialData(): void {
        const dataFromStorage = localStorage.getItem(this.LOCATION_KEY);
        if (dataFromStorage) {
            const locations = JSON.parse(dataFromStorage) as Location[];
            this.locationsSubject.next(locations);
        } else {
            localStorage.setItem(this.LOCATION_KEY, JSON.stringify(MOCK_LOCATIONS));
            this.locationsSubject.next(MOCK_LOCATIONS);
        }
    }

    private _saveToStorage(locations: Location[]): void {
        localStorage.setItem(this.LOCATION_KEY, JSON.stringify(locations));
        this.locationsSubject.next(locations);
    }
    
    // --- MÉTODOS DE LECTURA (ACTUALIZADOS) ---

    // Este método ya existía, pero ahora usa el Subject
    getLocations(): Location[] {
        return this.locationsSubject.getValue();
    }

    getLocationById(id: number): Location | undefined {
        return this.locationsSubject.getValue().find(location => location.id === id);
    }

    // --- MÉTODOS CRUD (PARA EL ADMIN) ---

    createLocation(location: Omit<Location, 'id'>): void {
        const currentLocations = this.getLocations();
        const newId = Math.max(...currentLocations.map(l => l.id), 0) + 1;
        const newLocation: Location = { ...location as Location, id: newId };

        this._saveToStorage([...currentLocations, newLocation]);
    }

    updateLocation(updatedLocation: Location): void {
        const currentLocations = this.getLocations();
        const updatedList = currentLocations.map(l => 
            l.id === updatedLocation.id ? updatedLocation : l
        );
        this._saveToStorage(updatedList);
    }

    deleteLocation(id: number): void {
        const currentLocations = this.getLocations();
        // Antes de eliminar, deberías revisar si hay barberos o citas asociadas.
        const updatedList = currentLocations.filter(l => l.id !== id);
        this._saveToStorage(updatedList);
    }
}