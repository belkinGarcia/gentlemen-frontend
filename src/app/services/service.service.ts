import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  imageUrl: string;
}

export interface Category {
  idTipoServicio: number;
  category: string;
  items: Service[];
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private readonly API_URL_CATEGORIES = 'http://localhost:8080/api/v1/tipoServicios';
  private readonly API_URL_SERVICES = 'http://localhost:8080/api/v1/servicios';

  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$: Observable<Category[]> = this.categoriesSubject.asObservable();

  private allServices: Service[] = [];

  constructor(private http: HttpClient) {
    this.loadCategories();
    this.categories$.subscribe(categories => {
      this.allServices = categories.flatMap(cat => cat.items);
    });
  }

  // --- Método Público para cargar datos ---
  
  /**
   * Carga todas las categorías desde el backend.
   * Es público para que BookingComponent pueda forzar la actualización al abrirse.
   */
  public loadCategories(): void {
    this.http.get<Category[]>(this.API_URL_CATEGORIES).subscribe({
      next: (categories) => {
        this.categoriesSubject.next(categories);
      },
      error: (err) => console.error('Error cargando categorías:', err)
    });
  }

  // (El método reloadCategories fue eliminado por redundante)

  // --- Métodos de Lectura ---

  getServicesByCategory(): Category[] {
    return this.categoriesSubject.getValue();
  }

  getServiceById(id: number): Service | undefined {
    return this.allServices.find(service => service.id === id);
  }

  // --- Métodos de Escritura (CRUD) ---

  createService(newServiceData: any): void { 
    const payload = {
        ...newServiceData,
        tipoServicio: { idTipoServicio: newServiceData.idTipoServicio }
    };

    this.http.post<Service>(this.API_URL_SERVICES, payload).subscribe({
      next: () => {
        this.loadCategories(); // <--- Llamada directa
      },
      error: (e) => console.error('Error creando servicio', e)
    });
  }

  updateService(updatedService: any): void {
    const payload = {
        ...updatedService,
        tipoServicio: { idTipoServicio: updatedService.idTipoServicio }
    };
    
    this.http.put<Service>(`${this.API_URL_SERVICES}/${updatedService.id}`, payload).subscribe({
      next: () => {
        this.loadCategories(); // <--- Llamada directa
      },
      error: (e) => console.error('Error actualizando servicio', e)
    });
  }

  deleteService(serviceToDelete: Service): void {
    this.http.delete(`${this.API_URL_SERVICES}/${serviceToDelete.id}`).subscribe({
      next: () => {
        this.loadCategories(); // <--- Llamada directa
      },
      error: (e) => console.error('Error eliminando servicio', e)
    });
  }
}