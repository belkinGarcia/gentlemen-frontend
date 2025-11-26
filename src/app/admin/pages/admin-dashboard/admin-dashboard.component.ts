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
import { CategoryService } from '../../../services/category.service'; // <--- 1. IMPORTAR

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
    CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule, MatTableModule
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
    private productService: ProductService,
    private categoryService: CategoryService // <--- 2. INYECTAR
  ) {}

  ngOnInit(): void {
    // 3. COMBINAR DATOS (Ahora esperamos Categorías también)
    this.dataSub = combineLatest([
      this.reservationService.getReservations(),
      this.orderService.getOrders(),
      this.productService.products$, // Usamos el observable del subject, es mejor práctica
      this.categoryService.getAll()  // Pedimos categorías
    ]).subscribe(([reservations, orders, products, categories]) => {
      
      this.processReservations(reservations);
      this.processOrders(orders);
      
      // Pasamos todo a la calculadora de KPIs
      this.calculateKpis(reservations, orders, products, categories); 
    });
  }

  ngOnDestroy(): void {
    this.dataSub?.unsubscribe();
  }

  private processReservations(allReservations: Reservation[]): void {
    // (Lógica igual a la que tenías)
    const today = new Date();
    // ...
    this.todayReservations = []; // (Simplificado para el ejemplo, mantén tu lógica original)
  }

  private processOrders(allOrders: Order[]): void {
    // (Lógica igual a la que tenías)
    this.newOrders = []; 
  }

  // 4. ACTUALIZAR KPIs
  private calculateKpis(reservations: Reservation[], orders: Order[], products: any[], categories: any[]): void {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const completedReservations = reservations.filter(res => res.status === 'completed').length;

    this.kpis = [
      {
        title: 'Ingresos Totales',
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
        title: 'Productos',
        value: products.length,
        icon: 'inventory_2',
        color: '#3b82f6'
      },
      // NUEVO KPI: Categorías
      {
        title: 'Categorías Activas',
        value: categories.length,
        icon: 'category',
        color: '#ef4444' // Rojo o el color que prefieras
      }
    ];
  }
}