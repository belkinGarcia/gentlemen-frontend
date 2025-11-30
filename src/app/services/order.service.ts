import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { AuthService } from './auth.service';

export interface Order {
  orderId: string;
  date: Date;
  status: 'Procesando' | 'Enviado' | 'Entregado' | 'Cancelado';
  total: number;
  shippingInfo: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    region: string;
    phone: string;
  };
  items: Array<{
    product: {
        name: string;
        price: number;
        imageUrl?: string;
    };
    quantity: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private API_URL = 'http://localhost:8080/api/v1/pedidos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getOrders(): Observable<Order[]> {
    const user = this.authService.getCurrentUser();
    const userId = user?.id || user?.idUsuario;

    if (!userId) return new BehaviorSubject([]).asObservable();

    return this.http.get<any[]>(`${this.API_URL}/usuario/${userId}`).pipe(
      map(javaOrders => javaOrders.map(p => this.mapJavaToAngular(p)))
    );
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<any>(`${this.API_URL}/${id}`).pipe(
      map(p => this.mapJavaToAngular(p))
    );
  }

  // --- AQUÍ ESTABA EL FALTANTE ---
  // Este método recibe los datos del Checkout y los envía a Java
// En order.service.ts

  createOrder(orderData: any): Observable<any> {
    const user = this.authService.getCurrentUser();
    const userId = user?.id || user?.idUsuario;

    const payload = {
        idUsuario: userId, // ID directo (int)
        total: orderData.total,
        direccion: orderData.shippingInfo.address,
        
        // Mapeamos detalles simple
        detalles: orderData.items.map((item: any) => ({
            idProducto: item.product.id,
            cantidad: item.quantity,
            precioUnitario: item.product.price
        }))
    };

    return this.http.post<any>(this.API_URL, payload);
  }
  
  // --- HELPERS ---
  private mapJavaToAngular(p: any): Order {
    return {
      orderId: p.idPedido.toString(),
      date: new Date(p.fechaPedido),
      status: this.mapStatus(p.estado),
      total: p.total,
      shippingInfo: {
        firstName: p.cliente?.nombres || 'Cliente',
        lastName: p.cliente?.apellidos || '',
        address: p.direccion || '',
        city: 'Lima', 
        region: 'Lima',
        phone: p.cliente?.celular || ''
      },
      items: p.detalles ? p.detalles.map((d: any) => ({
        product: {
            name: d.producto.nombre,
            price: d.precioUnitario,
            imageUrl: d.producto.imagenUrl
        },
        quantity: d.cantidad
      })) : []
    };
  }

  private mapStatus(javaStatus: string): any {
      if (javaStatus === 'PROCESANDO') return 'Procesando';
      if (javaStatus === 'ENVIADO') return 'Enviado';
      if (javaStatus === 'ENTREGADO') return 'Entregado';
      return 'Cancelado';
  }
  createPaymentPreference(items: any[], shippingCost: number): Observable<string> {
  const payload = {
    items: items.map(i => ({
      name: i.product.name,
      quantity: i.quantity,
      price: i.product.price
    })),
    shippingCost: shippingCost
  };

  // Esperamos que el backend devuelva un string (la URL)
  return this.http.post('http://localhost:8080/api/v1/payment/create_preference', payload, { responseType: 'text' });
}
}