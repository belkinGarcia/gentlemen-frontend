import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderService, Order } from '../../../services/order.service';
@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['orderId', 'date', 'status', 'total', 'actions'];
  dataSource: Order[] = [];
  private orderSub: Subscription | undefined;
  constructor(
    private router: Router,
    private orderService: OrderService
  ) {}
  ngOnInit(): void {
    this.orderSub = this.orderService.getOrders().subscribe(orders => {
      this.dataSource = orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }
  ngOnDestroy(): void {
    this.orderSub?.unsubscribe();
  }
  viewOrderDetails(orderId: string): void {
    console.log('Navegando a detalles del pedido:', orderId);
    this.router.navigate(['/mi-cuenta/pedidos', orderId]);
  }
  getStatusChipColor(status: 'Procesando' | 'Enviado' | 'Entregado'): string {
    switch (status) {
      case 'Procesando': return 'warn';
      case 'Enviado': return 'primary';
      case 'Entregado': return 'accent';
    }
  }
}