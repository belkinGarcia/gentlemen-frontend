import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Definimos la interfaz para claridad
export interface CartItem {
  product: any;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  // Almacén interno de los items
  private items: CartItem[] = [];

  // --- SUBCJECTS PARA EMITIR CAMBIOS ---
  
  // 1. Emite la lista actual de items
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  // 2. Emite la cantidad total de unidades
  private cartCountSubject = new BehaviorSubject<number>(0);

  // --- OBSERVABLES PÚBLICOS (Para que los componentes se suscriban) ---
  
  /**
   * Observable que emite la lista de items cada vez que cambia.
   * La página del carrito se suscribirá a esto.
   */
  public items$ = this.itemsSubject.asObservable();
  
  /**
   * Observable que emite la cantidad total de unidades.
   * El Header se suscribe a esto.
   */
  public cartCount$ = this.cartCountSubject.asObservable();

  constructor() { }

  /**
   * Añade un producto al carrito.
   * Si el producto ya existe, actualiza su cantidad.
   */
  addToCart(product: any, quantity: number): void {
    const existingItem = this.items.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
    
    // Notifica a todos los suscriptores sobre los cambios
    this.notifyUpdates();
  }

  /**
   * Actualiza la cantidad de un item específico en el carrito.
   * Si la cantidad es menor a 1, lo elimina.
   */
  updateItemQuantity(productId: number, newQuantity: number): void {
    const itemIndex = this.items.findIndex(item => item.product.id === productId);

    if (itemIndex > -1) {
      if (newQuantity < 1) {
        // Si la cantidad es 0 o menos, elimina el item
        this.items.splice(itemIndex, 1);
      } else {
        // Si no, actualiza la cantidad
        this.items[itemIndex].quantity = newQuantity;
      }
      
      this.notifyUpdates();
    }
  }

  /**
   * Elimina un producto del carrito, sin importar su cantidad.
   */
  removeItem(productId: number): void {
    this.items = this.items.filter(item => item.product.id !== productId);
    this.notifyUpdates();
  }

  // --- ¡MÉTODO AÑADIDO! ---
  /**
   * Vacía el carrito por completo.
   * Se llama después de un checkout exitoso.
   */
  clearCart(): void {
    this.items = []; // Resetea el array
    this.notifyUpdates(); // Notifica los cambios (carrito a 0)
  }

  /**
   * Método privado para calcular totales y
   * notificar a todos los suscriptores (Header y CartPage).
   */
  private notifyUpdates(): void {
    // 1. Calcula la nueva cantidad total de unidades
    const totalQuantity = this.items.reduce((total, item) => total + item.quantity, 0);
    
    // 2. Emite la nueva cantidad total
    this.cartCountSubject.next(totalQuantity);
    
    // 3. Emite la nueva lista de items (una copia)
    this.itemsSubject.next([...this.items]);
  }
}