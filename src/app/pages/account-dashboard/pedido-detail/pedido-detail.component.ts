import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

// --- ¡IMPORTAMOS EL SERVICIO Y LA INTERFAZ! ---
import { OrderService, Order } from '../../../services/order.service'; // Ajusta la ruta

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

  order: Order | undefined; // <-- Ahora usa la interfaz 'Order'
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService // <-- Inyecta el servicio
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    
    // Llama al servicio (que ahora lee del BehaviorSubject)
    if (orderId) {
      this.order = this.orderService.getOrderById(orderId);
    }
    
    this.isLoading = false;

    if (!this.order) {
      // Este es el error que estás viendo en la consola
      console.error("No se encontró el pedido con ID:", orderId);
    }
  }

  goBack(): void {
    this.router.navigate(['/mi-cuenta/pedidos']);
  }

  getStatusChipColor(status: 'Procesando' | 'Enviado' | 'Entregado'): string {
    switch (status) {
      case 'Procesando': return 'warn';
      case 'Enviado': return 'primary';
      case 'Entregado': return 'accent';
    }
  }
}