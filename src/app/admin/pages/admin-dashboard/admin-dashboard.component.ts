// src/app/admin/pages/admin-dashboard/admin-dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router'; // Para botones de acceso rápido
import { Subscription, combineLatest } from 'rxjs'; // Para combinar observables
import { ProductService } from '../../../services/product.service'; // <-- ¡NUEVA IMPORTACIÓN!

// Servicios
import { ReservationService, Reservation } from '../../../services/reservation.service';
import { OrderService, Order } from '../../../services/order.service';

// Interfaz para las estadísticas clave
interface Kpi {
  title: string;
  value: number | string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {

  kpis: Kpi[] = [];
  todayReservations: Reservation[] = [];
  newOrders: Order[] = [];
  
  // Tablas
  displayedReservationColumns: string[] = ['time', 'client', 'service', 'barber'];
  displayedOrderColumns: string[] = ['orderId', 'client', 'total', 'actions'];

  private dataSub: Subscription | undefined;

  constructor(
    private reservationService: ReservationService,
    private orderService: OrderService,
    private productService: ProductService
  ) {}

 ngOnInit(): void {
    // Combinamos todos los servicios para obtener los datos
    // NOTA: Para obtener los productos de forma reactiva, debemos añadir su observable.
    // Como el ProductService solo tiene .products$, usaremos un método simple por ahora.
    
    this.dataSub = combineLatest([
      this.reservationService.getReservations(),
      this.orderService.getOrders()
      // Idealmente: this.productService.products$
    ]).subscribe(([reservations, orders]) => {
      this.processReservations(reservations);
      this.processOrders(orders);
      // Incluye la lista de productos para el cálculo
      this.calculateKpis(reservations, orders, this.productService.getAllProducts()); 
    });
  }

  ngOnDestroy(): void {
    this.dataSub?.unsubscribe();
  }
  
  /**
   * Procesa la lista de reservas para encontrar las de hoy.
   */
  private processReservations(allReservations: Reservation[]): void {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getDay(), today.getDate());
    
    // Filtramos por citas próximas que sean HOY
    this.todayReservations = allReservations
      .filter(res => res.status === 'upcoming' && new Date(res.date!).toDateString() === today.toDateString())
      .sort((a, b) => (a.time! > b.time! ? 1 : -1)) // Ordenamos por hora
      .slice(0, 5); // Solo mostramos 5 para el dashboard
  }

  /**
   * Procesa la lista de pedidos para encontrar los nuevos (Procesando).
   */
  private processOrders(allOrders: Order[]): void {
    this.newOrders = allOrders
      .filter(order => order.status === 'Procesando')
      .sort((a, b) => b.date.getTime() - a.date.getTime()) // Ordenamos por fecha, más nuevos primero
      .slice(0, 5); // Solo mostramos 5 para el dashboard
  }
  
  /**
   * Calcula los indicadores clave (simulado).
   */
 private calculateKpis(reservations: Reservation[], orders: Order[], products: any[]): void {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const completedReservations = reservations.filter(res => res.status === 'completed').length;
    
    // --- ¡CÁLCULO CORREGIDO! ---
    const totalProductsInStock = products.length; // Cuenta cuántos productos existen en tu catálogo
    // Si tu producto tuviera una propiedad 'stock', usarías:
    // products.reduce((sum, product) => sum + product.stock, 0);

    this.kpis = [
      {
        title: 'Ingresos Totales (Mock)',
        value: totalRevenue.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' }),
        icon: 'attach_money',
        color: '#22c55e'
      },
      {
        title: 'Citas Próximas',
        value: reservations.filter(res => res.status === 'upcoming').length,
        icon: 'schedule',
        color: '#f97316'
      },
      {
        title: 'Citas Atendidas (Mock)',
        value: completedReservations,
        icon: 'check_circle',
        color: '#3b82f6'
      },
      {
        title: 'Productos en Catálogo', // Renombrado de 'Stock' a 'Catálogo' para mayor precisión
        value: totalProductsInStock, // <-- VALOR DINÁMICO
        icon: 'inventory',
        color: '#ef4444'
      }
    ];
  }
}