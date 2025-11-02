// src/app/admin/pages/order-management/order-management.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select'; // Para el dropdown
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router'; // Para el link de detalle
import { Subscription } from 'rxjs';
import { OrderService, Order } from '../../../services/order.service'; // Ajusta la ruta (../..)

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.css']
})
export class OrderManagementComponent implements OnInit, OnDestroy {

  // Columnas para la tabla de admin
  displayedColumns: string[] = ['orderId', 'date', 'client', 'total', 'status', 'actions'];
  dataSource: Order[] = [];
  private orderSub: Subscription | undefined;

  constructor(
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    // Nos suscribimos al servicio para obtener TODOS los pedidos
    this.orderSub = this.orderService.getOrders().subscribe(orders => {
      // Ordenamos por fecha, los más nuevos primero
      this.dataSource = orders.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });
  }

  ngOnDestroy(): void {
    this.orderSub?.unsubscribe();
  }

  /**
   * Se llama cuando el admin cambia el estado en el dropdown
   */
  onStatusChange(order: Order, newStatus: 'Procesando' | 'Enviado' | 'Entregado'): void {
    console.log(`Cambiando estado de ${order.orderId} a ${newStatus}`);
    // En una app real, llamarías a:
    // this.orderService.updateOrderStatus(order.orderId, newStatus)
    
    // Como es un mock, actualizamos el dato en el array local para que se vea el cambio
    // (Esto se reseteará al recargar, pero sirve para la demo visual)
    order.status = newStatus;
  }
}