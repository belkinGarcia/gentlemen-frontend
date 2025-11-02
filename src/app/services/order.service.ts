import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from './cart.service';

// --- Interfaz para un Pedido ---
export interface Order {
  orderId: string;
  date: Date;
  items: CartItem[];
  total: number;
  shippingInfo: any;
  status: 'Procesando' | 'Enviado' | 'Entregado';
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly ORDER_KEY = 'user_orders';

  private ordersSubject = new BehaviorSubject<Order[]>(this.getOrdersFromStorage());
  public orders$: Observable<Order[]> = this.ordersSubject.asObservable();

  constructor() { }

  private getOrdersFromStorage(): Order[] {
    const ordersString = localStorage.getItem(this.ORDER_KEY);
    if (!ordersString) {
      return [];
    }
    try {
      // 1. Parseamos el JSON
      const parsedOrders = JSON.parse(ordersString) as Order[];
      
      // 2. ¡CORRECCIÓN! "Rehidratamos" las fechas
      // JSON.parse() no convierte strings de fecha a objetos Date
      return parsedOrders.map(order => ({
        ...order,
        date: new Date(order.date) // Convierte el string de fecha a un objeto Date
      }));
    } catch (e) {
      console.error("Error al parsear pedidos de localStorage", e);
      return [];
    }
  }

  public getOrders(): Observable<Order[]> {
    return this.orders$;
  }

  // --- ¡FUNCIÓN ACTUALIZADA! ---
  /**
   * Busca un solo pedido por su ID en la lista de pedidos actual.
   * Lee desde el BehaviorSubject para asegurar que tiene los datos más recientes.
   */
  public getOrderById(id: string): Order | undefined {
    // Lee desde el valor actual del Subject, no desde localStorage
    const allOrders = this.ordersSubject.getValue(); 
    return allOrders.find(order => order.orderId === id);
  }

  public createOrder(items: CartItem[], total: number, shippingInfo: any): Order {
    
    const newOrder: Order = {
      orderId: `P-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date(),
      items: items,
      total: total,
      shippingInfo: shippingInfo,
      status: 'Procesando'
    };

    const currentOrders = this.getOrdersFromStorage();
    const updatedOrders = [...currentOrders, newOrder];

    localStorage.setItem(this.ORDER_KEY, JSON.stringify(updatedOrders));
    this.ordersSubject.next(updatedOrders);
    
    console.log("Pedido guardado en el servicio:", newOrder);
    return newOrder;
  }
}