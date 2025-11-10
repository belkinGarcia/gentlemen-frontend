import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderService, Order } from '../../../services/order.service';
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
  displayedColumns: string[] = ['orderId', 'date', 'client', 'total', 'status', 'actions'];
  dataSource: Order[] = [];
  private orderSub: Subscription | undefined;
  constructor(
    private orderService: OrderService
  ) {}
  ngOnInit(): void {
    this.orderSub = this.orderService.getOrders().subscribe(orders => {
      this.dataSource = orders.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });
  }
  ngOnDestroy(): void {
    this.orderSub?.unsubscribe();
  }
  onStatusChange(order: Order, newStatus: 'Procesando' | 'Enviado' | 'Entregado'): void {
    console.log(`Cambiando estado de ${order.orderId} a ${newStatus}`);
    order.status = newStatus;
  }
}