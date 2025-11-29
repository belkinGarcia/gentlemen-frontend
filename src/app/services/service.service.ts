import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';

// Interfaz para los servicios individuales (coincide con Servicio.java)
export interface Service {
  id: number;
  name: string;
  description: string;
  // price viene como número de la conversión de BigDecimal en Java
  price: number;
  duration: number; // Duración en minutos
  imageUrl: string;
}

// Interfaz para las categorías (coincide con TipoServicio.java)
export interface Category {
  // idTipoServicio es necesario para operaciones en el backend
  idTipoServicio: number;
  category: string; // Mapeado desde 'nombre' en Java
  items: Service[]; // Mapeado desde 'servicios' en Java
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  // Endpoint principal para listar todas las categorías/servicios
  private readonly API_URL_CATEGORIES = 'http://localhost:8080/api/v1/tipoServicios';
  // Endpoint para operaciones CRUD individuales de servicios
  private readonly API_URL_SERVICES = 'http://localhost:8080/api/v1/servicios';

  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$: Observable<Category[]> = this.categoriesSubject.asObservable();

  private allServices: Service[] = [];

  constructor(private http: HttpClient) {
    this.loadCategories();
    // Suscripción para mantener una lista plana de servicios para búsquedas rápidas
    this.categories$.subscribe(categories => {
      // Utilizamos flatMap para aplanar la lista anidada (Category -> items)
      this.allServices = categories.flatMap(cat => cat.items);
    });
  }

  /**
   * Carga todas las categorías de servicios desde el backend.
   */
  private loadCategories(): void {
    // 💡 Reemplazamos MOCK y localStorage por la llamada HTTP
    this.http.get<Category[]>(this.API_URL_CATEGORIES).subscribe({
      next: (categories) => {
        this.categoriesSubject.next(categories);
      },
      error: (err) => console.error('Error cargando categorías de servicios:', err)
    });
  }

  /**
   * Vuelve a cargar la lista de categorías. Es la forma más sencilla de
   * sincronizar el estado local después de un POST, PUT o DELETE en un servicio anidado.
   */
  private reloadCategories(): void {
    this.loadCategories();
  }

  // --- Métodos de Lectura ---

  getServicesByCategory(): Category[] {
    return this.categoriesSubject.getValue();
  }

  getServiceById(id: number): Service | undefined {
    return this.allServices.find(service => service.id === id);
  }

  // --- Métodos de Escritura (CRUD) actualizados ---

  /**
   * Crea un nuevo servicio individual.
   * Se asume que el objeto `newServiceData` incluye el `idTipoServicio` de la categoría.
   */
  createService(newServiceData: Service & { idTipoServicio: number }): void {
    // Preparamos el payload para que coincida con lo que Servicio.java espera en el POST
    const payload = {
        ...newServiceData,
        // Spring espera el objeto de la relación, no solo el ID
        tipoServicio: { idTipoServicio: newServiceData.idTipoServicio }
    };

    // Llamada al endpoint de Servicios
    this.http.post<Service>(this.API_URL_SERVICES, payload).subscribe({
      next: () => {
        this.reloadCategories();
      },
      error: (e) => console.error('Error creando servicio', e)
    });
  }

  /**
   * Actualiza un servicio existente.
   */
  updateService(updatedService: Service & { idTipoServicio: number }): void {
    const payload = {
        ...updatedService,
        tipoServicio: { idTipoServicio: updatedService.idTipoServicio }
    };
    
    this.http.put<Service>(`${this.API_URL_SERVICES}/${updatedService.id}`, payload).subscribe({
      next: () => {
        this.reloadCategories();
      },
      error: (e) => console.error('Error actualizando servicio', e)
    });
  }

  /**
   * Elimina un servicio existente.
   */
  deleteService(serviceToDelete: Service): void {
    this.http.delete(`${this.API_URL_SERVICES}/${serviceToDelete.id}`).subscribe({
      next: () => {
        this.reloadCategories();
      },
      error: (e) => console.error('Error eliminando servicio', e)
    });
  }
}
