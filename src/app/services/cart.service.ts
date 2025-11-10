import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export interface CartItem {
  product: any;
  quantity: number;
}
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  private cartCountSubject = new BehaviorSubject<number>(0);
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
        this.items.splice(itemIndex, 1);
      } else {
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
  /**
   * Vacía el carrito por completo.
   * Se llama después de un checkout exitoso.
   */
  clearCart(): void {
    this.items = [];
    this.notifyUpdates();
  }
  /**
   * Método privado para calcular totales y
   * notificar a todos los suscriptores (Header y CartPage).
   */
  private notifyUpdates(): void {
    const totalQuantity = this.items.reduce((total, item) => total + item.quantity, 0);
    this.cartCountSubject.next(totalQuantity);
    this.itemsSubject.next([...this.items]);
  }
}