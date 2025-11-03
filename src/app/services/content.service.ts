// src/app/services/content.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface StepGuide {
  title: string;
  description: string;
  // Solo el contacto necesita estos campos
  whatsappNumber?: string;
  whatsappLink?: string;
}

// Estructura maestra que contiene la guía para los 6 pasos
export interface ContentData {
  [key: string]: StepGuide;
}

const DEFAULT_GUIDES: ContentData = {
  // === GUÍAS DE LOS PASOS ===
  step1: { title: 'Seleccionar local', description: 'Selecciona el local de tu reserva' },
  step2: { title: 'Selecciona tu servicio', description: 'Seleccione un servicio para el que desea programar una cita' },
  step3: { title: 'Selecciona al barbero', description: 'Elige un barbero o selecciona "Cualquier agente" para asignarte uno automáticamente.' },
  step4: { title: 'Selecciona fecha & hora', description: 'Haga clic en una fecha para ver las franjas horarias disponibles...' },
  step5: { title: 'Ingresa tu información', description: 'Inicia sesión o crea una cuenta para continuar con tu reserva.' },
  step6: { title: 'Confirmación', description: 'Su cita se ha programado correctamente.' },

  // === CONTACTO (CONTACTO ES LA ÚNICA EXCEPCIÓN GLOBAL) ===
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

  private readonly CONTENT_KEY = 'content_booking_guide';
  
  private contentSubject = new BehaviorSubject<ContentData>(this.loadFromStorage());
  public content$: Observable<ContentData> = this.contentSubject.asObservable();

  constructor() {}

  private loadFromStorage(): ContentData {
    const data = localStorage.getItem(this.CONTENT_KEY);
    return data ? { ...DEFAULT_GUIDES, ...JSON.parse(data) } : DEFAULT_GUIDES;
  }

  getContent(): ContentData {
    return this.contentSubject.getValue();
  }

  // Ahora acepta la clave genérica del paso (ej: 'step1', 'contact')
  updateGuide(key: string, updatedGuide: StepGuide): void {
    const currentContent = this.getContent();
    const newContent = {
      ...currentContent,
      [key]: updatedGuide
    };
    this._saveToStorage(newContent);
  }

  private _saveToStorage(content: ContentData): void {
    localStorage.setItem(this.CONTENT_KEY, JSON.stringify(content));
    this.contentSubject.next(content);
  }
}