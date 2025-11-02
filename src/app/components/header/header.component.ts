// src/app/components/header/header.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookingComponent } from '../booking/booking.component';
import { MatMenuModule } from '@angular/material/menu';
import { CartService } from '../../services/cart.service';
import { Subscription, Observable} from 'rxjs';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common'; // <-- ¡Importante para *ngIf y async!
import { AuthService } from '../../services/auth.service'; // <-- Importa tu servicio

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, // <-- ¡Asegúrate de que esté aquí!
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule,
    RouterModule,
    MatBadgeModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  
  public isLoggedIn$: Observable<boolean>; // Propiedad para el estado de login
  cartItemCount: number = 0;
  private cartSubscription: Subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    private cartService: CartService,
    private authService: AuthService // <-- 1. Inyecta el AuthService
  ) {
    // 2. Asigna el observable reactivo
    this.isLoggedIn$ = this.authService.loggedIn$; 
  }

  ngOnInit(): void {
    // Suscripción al carrito (esto ya lo tenías)
    this.cartSubscription = this.cartService.cartCount$.subscribe(count => {
      this.cartItemCount = count;
    });
  }

  ngOnDestroy(): void {
    // Limpia la suscripción
    this.cartSubscription.unsubscribe();
  }

  openBookingDialog(): void {
    this.dialog.open(BookingComponent, {
      width: '90%',
      maxWidth: '1200px',
    });
  }

  // 3. Método para cerrar sesión
  logout(): void {
    this.authService.logout();
  }
}