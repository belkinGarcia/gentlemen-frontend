import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // IMPORTANTE
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface StepGuide {
  title: string;
  description: string;
  whatsappNumber?: string;
  whatsappLink?: string;
  pasoKey?: string; // Agregado para coincidir con el backend
}

export interface ContentData {
  [key: string]: StepGuide;
}

// Mantenemos los defaults por si falla la red
const DEFAULT_GUIDES: ContentData = {
  step1: { title: 'Seleccionar local', description: 'Selecciona el local de tu reserva' },
  // ... resto de defaults ...
  contact: {
    title: '¿Consultas?',
    description: 'Escríbenos al WhatsApp',
    whatsappNumber: '995 515 022',
    whatsappLink: 'https://wa.me/51995515022'
  }
};

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private readonly API_URL = 'http://localhost:8080/api/v1/content';
  
  // Inicializamos vacío, se llenará al cargar la APP
  private contentSubject = new BehaviorSubject<ContentData>({}); 
  public content$: Observable<ContentData> = this.contentSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFromBackend();
  }

  // Carga inicial desde la API
  public loadFromBackend(): void {
    this.http.get<any[]>(this.API_URL).pipe(
      map(items => {
        // TRANSFORMACIÓN: Convertimos el Array de Java [{},{}] 
        // al Objeto de Angular { key: {}, key2: {} }
        const dataMap: ContentData = {};
        items.forEach(item => {
          dataMap[item.pasoKey] = {
            title: item.title,
            description: item.description,
            whatsappNumber: item.whatsappNumber,
            whatsappLink: item.whatsappLink
          };
        });
        return dataMap;
      })
    ).subscribe({
      next: (data) => {
        // Si viene vacío (primera vez antes de que el backend cree defaults), usamos defaults
        if (Object.keys(data).length === 0) {
           this.contentSubject.next(DEFAULT_GUIDES);
        } else {
           this.contentSubject.next(data);
        }
      },
      error: (err) => {
        console.error('Error cargando contenido, usando defaults', err);
        this.contentSubject.next(DEFAULT_GUIDES);
      }
    });
  }

  getContent(): ContentData {
    return this.contentSubject.getValue();
  }

  updateGuide(key: string, updatedGuide: StepGuide): void {
    // 1. Actualización Optimista (Local)
    const currentContent = this.getContent();
    const newContent = { ...currentContent, [key]: updatedGuide };
    this.contentSubject.next(newContent);

    // 2. Enviar al Backend
    // Mapeamos al formato que espera Java (GuiaPaso)
    const payload = {
      pasoKey: key,
      title: updatedGuide.title,
      description: updatedGuide.description,
      whatsappNumber: updatedGuide.whatsappNumber,
      whatsappLink: updatedGuide.whatsappLink
    };

    this.http.put(`${this.API_URL}/${key}`, payload).subscribe({
      next: (res) => console.log('Guardado en BD:', res),
      error: (err) => {
        console.error('Error guardando en BD:', err);
        // Opcional: Revertir cambios si falla
      }
    });
  }
}