import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartService, CartItem } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import { UiStateService } from '../../services/ui-state.service';
@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  private cartSubscription: Subscription = new Subscription();
  constructor(
    private cartService: CartService,
    private uiStateService: UiStateService
  ) {}
  ngOnInit(): void {
    this.uiStateService.setHeroState({
      type: 'banner',
      title: 'MI CARRITO',
      imageUrl: 'https://cdn.midjourney.com/c0d03bc8-50cc-4dc3-9199-1abd30f85020/0_0.png'
    });
    this.cartSubscription = this.cartService.items$.subscribe(items => {
      this.cartItems = items;
      this.calculateSubtotal();
    });
  }
  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }
  /**
   * Calcula el subtotal basado en los items del carrito.
   */
  calculateSubtotal(): void {
    this.subtotal = this.cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }
  increaseQuantity(item: CartItem): void {
    this.cartService.updateItemQuantity(item.product.id, item.quantity + 1);
  }
  decreaseQuantity(item: CartItem): void {
    this.cartService.updateItemQuantity(item.product.id, item.quantity - 1);
  }
  removeItem(item: CartItem): void {
    this.cartService.removeItem(item.product.id);
  }
}