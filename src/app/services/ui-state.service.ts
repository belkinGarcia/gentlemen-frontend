import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Definimos los posibles tipos de estado para el banner
export interface HeroState {
  type: 'carousel' | 'banner' | 'none';
  title?: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UiStateService {
  // Creamos un BehaviorSubject que guardará el estado actual del banner.
  // El estado inicial es el carrusel, para la página de inicio.
  private heroState = new BehaviorSubject<HeroState>({ type: 'carousel' });

  // Creamos un Observable público para que los componentes puedan suscribirse a los cambios.
  public heroState$ = this.heroState.asObservable();

  constructor() { }

  // Un método público para que cualquier componente pueda cambiar el estado del banner.
  setHeroState(newState: HeroState): void {
    this.heroState.next(newState);
  }
}