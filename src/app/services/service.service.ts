// src/app/services/service.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Interfaz para la estructura del Servicio
export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number; // <-- ¡CLAVE NUEVA! (Duración en minutos)
}

// Interfaz para la estructura de Categorías
export interface Category {
  category: string;
  items: Service[];
}

// Datos MOCK iniciales (Base de datos)
const MOCK_SERVICES: Category[] = [
  {
    category: 'Corte de Cabello',
    items: [
      { id: 101, name: 'Corte Clásico', description: 'Corte con máquina y tijera.', price: 50, duration: 40 },
      { id: 102, name: 'Corte Fade Premium', description: 'Degradado profesional, incluye lavado.', price: 75, duration: 60 },
    ]
  },
  {
    category: 'Barba y Afeitado',
    items: [
      { id: 201, name: 'Arreglo de Barba', description: 'Perfilado y arreglo con máquina.', price: 30, duration: 30 },
      { id: 202, name: 'Afeitado Clásico', description: 'Afeitado con navaja, toallas calientes.', price: 45, duration: 45 },
    ]
  },
  {
    category: 'Paquetes',
    items: [
      { id: 301, name: 'Corte + Barba Express', description: 'Corte rápido y perfilado de barba.', price: 80, duration: 70 }, // Duración 40+30=70
    ]
  }
];

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private readonly SERVICE_KEY = 'service_database';

  // BehaviorSubject para la lista de categorías
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$: Observable<Category[]> = this.categoriesSubject.asObservable();
  
  // Lista plana de todos los servicios para búsqueda rápida
  private allServices: Service[] = [];

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    const dataFromStorage = localStorage.getItem(this.SERVICE_KEY);
    if (dataFromStorage) {
      this.categoriesSubject.next(JSON.parse(dataFromStorage));
    } else {
      localStorage.setItem(this.SERVICE_KEY, JSON.stringify(MOCK_SERVICES));
      this.categoriesSubject.next(MOCK_SERVICES);
    }
    this.updateAllServicesList(this.categoriesSubject.getValue());
  }
  
  private updateAllServicesList(categories: Category[]): void {
    this.allServices = categories.flatMap(cat => cat.items);
  }
  
 // --- MÉTODOS DE LECTURA (ACTUALIZADOS) ---

  getServicesByCategory(): Category[] {
    return this.categoriesSubject.getValue();
  }

  getServiceById(id: number): Service | undefined {
    return this.allServices.find(service => service.id === id);
  }
  
  // --- ¡NUEVOS MÉTODOS CRUD (SOLUCIONAN TS2339)! ---

  private _saveCategories(categories: Category[]): void {
    localStorage.setItem(this.SERVICE_KEY, JSON.stringify(categories));
    this.categoriesSubject.next(categories);
    this.updateAllServicesList(categories);
  }

  createService(newServiceData: any): void { // newServiceData incluye {name, price, duration, category...}
    let categories = this.getServicesByCategory();
    
    // 1. Encuentra la categoría o crea una nueva
    let category = categories.find(c => c.category === newServiceData.category);

    if (!category) {
      category = { category: newServiceData.category, items: [] };
      categories = [...categories, category];
    }

    // 2. Asigna ID y añade el servicio
    const newId = Math.max(...this.allServices.map(s => s.id), 0) + 1;
    const newService: Service = { ...newServiceData, id: newId };
    category.items.push(newService);

    this._saveCategories(categories);
  }

  updateService(updatedService: Service & { category: string }): void {
    const categories = this.getServicesByCategory();
    
    const updatedCategories = categories.map(cat => {
      // 1. Si el servicio pertenece a esta categoría
      const itemIndex = cat.items.findIndex(item => item.id === updatedService.id);
      
      if (itemIndex > -1) {
        // 2. Reemplaza el servicio
        cat.items[itemIndex] = updatedService;
      }
      return cat;
    });

    this._saveCategories(updatedCategories);
  }

  deleteService(serviceToDelete: Service): void {
    const categories = this.getServicesByCategory();
    
    const updatedCategories = categories.map(cat => {
      // Filtra el servicio de su categoría
      cat.items = cat.items.filter(item => item.id !== serviceToDelete.id);
      return cat;
    });

    this._saveCategories(updatedCategories.filter(cat => cat.items.length > 0)); // Elimina categorías vacías
  }
}