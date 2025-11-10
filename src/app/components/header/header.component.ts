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
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
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
  public isLoggedIn$: Observable<boolean>;
  cartItemCount: number = 0;
  private cartSubscription: Subscription = new Subscription();
  constructor(
    public dialog: MatDialog,
    private cartService: CartService,
    private authService: AuthService
  ) {
    this.isLoggedIn$ = this.authService.loggedIn$; 
  }
  ngOnInit(): void {
    this.cartSubscription = this.cartService.cartCount$.subscribe(count => {
      this.cartItemCount = count;
    });
  }
  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }
  openBookingDialog(): void {
    this.dialog.open(BookingComponent, {
      width: '90%',
      maxWidth: '1200px',
    });
  }
  logout(): void {
    this.authService.logout();
  }
}