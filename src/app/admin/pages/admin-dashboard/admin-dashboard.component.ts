import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { ReservationService, Reservation } from '../../../services/reservation.service';
import { OrderService, Order } from '../../../services/order.service';
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
  displayedReservationColumns: string[] = ['time', 'client', 'service', 'barber'];
  displayedOrderColumns: string[] = ['orderId', 'client', 'total', 'actions'];
  private dataSub: Subscription | undefined;
  constructor(
    private reservationService: ReservationService,
    private orderService: OrderService,
    private productService: ProductService
  ) {}
 ngOnInit(): void {
    this.dataSub = combineLatest([
      this.reservationService.getReservations(),
      this.orderService.getOrders()
    ]).subscribe(([reservations, orders]) => {
      this.processReservations(reservations);
      this.processOrders(orders);
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
    this.todayReservations = allReservations
      .filter(res => res.status === 'upcoming' && new Date(res.date!).toDateString() === today.toDateString())
      .sort((a, b) => (a.time! > b.time! ? 1 : -1))
      .slice(0, 5);
  }
  /**
   * Procesa la lista de pedidos para encontrar los nuevos (Procesando).
   */
  private processOrders(allOrders: Order[]): void {
    this.newOrders = allOrders
      .filter(order => order.status === 'Procesando')
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  }
  /**
   * Calcula los indicadores clave (simulado).
   */
 private calculateKpis(reservations: Reservation[], orders: Order[], products: any[]): void {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const completedReservations = reservations.filter(res => res.status === 'completed').length;
    const totalProductsInStock = products.length;
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
        title: 'Productos en Catálogo',
        value: totalProductsInStock,
        icon: 'inventory',
        color: '#ef4444'
      }
    ];
  }
}