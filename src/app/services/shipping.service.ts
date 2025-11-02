// src/app/services/shipping.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  private readonly SHIPPING_KEY = 'shipping_cost';
  private readonly DEFAULT_COST = 15.00; // Costo por defecto (ajustado)
  private readonly FREE_SHIPPING_THRESHOLD = 250.00; // <-- ¡NUEVO! Umbral de envío gratuito
  
  private costSubject = new BehaviorSubject<number>(this.loadCostFromStorage());
  public cost$: Observable<number> = this.costSubject.asObservable();

  constructor() { }

  private loadCostFromStorage(): number {
    const cost = localStorage.getItem(this.SHIPPING_KEY);
    return cost ? parseFloat(cost) : this.DEFAULT_COST;
  }

  getShippingCost(): number {
    return this.costSubject.getValue();
  }

  setShippingCost(newCost: number): void {
    if (newCost < 0) newCost = 0;
    
    localStorage.setItem(this.SHIPPING_KEY, newCost.toString());
    this.costSubject.next(newCost);
  }
  
  // --- ¡MÉTODO CLAVE ACTUALIZADO! ---
  /**
   * Calcula el costo final del envío aplicando el umbral.
   */
  calculateFinalShippingCost(subtotal: number): number {
    const baseCost = this.getShippingCost();
    
    if (subtotal >= this.FREE_SHIPPING_THRESHOLD) {
      return 0.00;
    }
    return baseCost;
  }
  
  /**
   * Devuelve el umbral de envío gratuito (para mensajes de UX).
   */
  getFreeShippingThreshold(): number {
      return this.FREE_SHIPPING_THRESHOLD;
  }
}