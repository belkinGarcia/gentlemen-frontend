import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { OrderService, Order } from '../../../services/order.service';
@Component({
  selector: 'app-pedido-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './pedido-detail.component.html',
  styleUrls: ['./pedido-detail.component.css']
})
export class PedidoDetailComponent implements OnInit {
  order: Order | undefined;
  isLoading = true;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}
  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    
    if (orderId) {
      this.isLoading = true; // Mostrar carga
      
      // CAMBIO: Ahora nos suscribimos al Observable del servicio
      this.orderService.getOrderById(orderId).subscribe({
        next: (order) => {
          this.order = order;
          this.isLoading = false;
        },
        error: (err) => {
          console.error("No se encontró el pedido:", err);
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }
  goBack(): void {
    this.router.navigate(['/mi-cuenta/pedidos']);
  }
  getStatusChipColor(status: string): string {
    switch (status) {
      case 'Procesando': return 'warn';
      case 'Enviado': return 'primary';
      case 'Entregado': return 'accent';
      case 'Cancelado': return 'warn'; // Agregamos este caso
      default: return 'primary';
    }
  }
}