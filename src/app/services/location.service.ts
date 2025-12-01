import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface Location {
    id: number;
    name: string;
    address: string;
    imageUrl: string;
    mapLink: string;
    phone: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
    private readonly API_URL = 'http://localhost:8080/api/v1/sedes';

    private locationsSubject = new BehaviorSubject<Location[]>([]);
    public locations$: Observable<Location[]> = this.locationsSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadAllLocations();
    }

    /**
     * Carga inicial desde el backend
     */
    private loadAllLocations(): void {
        this.http.get<Location[]>(this.API_URL).subscribe({
            next: (data) => {
                this.locationsSubject.next(data);
            },
            error: (err) => console.error('Error al cargar sedes:', err)
        });
    }

    /**
     * Obtiene el valor actual almacenado en el Subject (útil para filtrados síncronos)
     */
    getLocations(): Location[] {
        return this.locationsSubject.getValue();
    }

    /**
     * Busca una sede por ID en la memoria actual
     */
    getLocationById(id: number): Location | undefined {
        return this.locationsSubject.getValue().find(location => location.id === id);
    }

    createLocation(location: Omit<Location, 'id'>): void {
        this.http.post<Location>(this.API_URL, location).subscribe({
            next: (newLocation) => {
                const currentLocations = this.getLocations();
                // Agregamos la nueva sede devuelta por el backend (que ya incluye el ID generado)
                this.locationsSubject.next([...currentLocations, newLocation]);
            },
            error: (err) => console.error('Error al crear sede:', err)
        });
    }

    updateLocation(updatedLocation: Location): void {
        // Tu controlador espera PUT /api/v1/sedes/{id}
        const url = `${this.API_URL}/${updatedLocation.id}`;

        this.http.put<Location>(url, updatedLocation).subscribe({
            next: (sedeActualizada) => {
                const currentLocations = this.getLocations();
                const updatedList = currentLocations.map(l =>
                    l.id === sedeActualizada.id ? sedeActualizada : l
                );
                this.locationsSubject.next(updatedList);
            },
            error: (err) => console.error('Error al actualizar sede:', err)
        });
    }

    deleteLocation(id: number): void {
        const url = `${this.API_URL}/${id}`;

        this.http.delete(url).subscribe({
            next: () => {
                const currentLocations = this.getLocations();
                const updatedList = currentLocations.filter(l => l.id !== id);
                this.locationsSubject.next(updatedList);
            },
            error: (err) => console.error('Error al eliminar sede:', err)
        });
    }
}
