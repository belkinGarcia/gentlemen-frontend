import { Component, Inject, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ProductListComponent } from '../product-list/product-list.component';
import { ProductService } from '../../services/product.service';
import { CartService, CartItem } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-to-cart-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    ProductListComponent
  ],
  templateUrl: './add-to-cart-dialog.component.html',
  styleUrls: ['./add-to-cart-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddToCartDialogComponent implements OnInit, OnDestroy { 
  
  addedProduct: any;
  recommendedProducts: any[] = [];
  addedQuantity: number = 0;
  private cartSubscription: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<AddToCartDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: any },
    private productService: ProductService,
    private cartService: CartService
  ) {
    this.addedProduct = data.product;
  }

  ngOnInit(): void {
    this.loadRecommendedProducts();

    this.cartSubscription = this.cartService.items$.subscribe(items => {
      const itemInCart = items.find(item => item.product.id === this.addedProduct.id);
      if (itemInCart) {
        this.addedQuantity = itemInCart.quantity;
      } else {
        this.addedQuantity = 0; 
      }
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }

  /**
   * Baraja un array usando el algoritmo Fisher-Yates.
   */
  private shuffleArray(array: any[]): any[] {
    let currentIndex = array.length,  randomIndex;
    // Mientras queden elementos por barajar.
    while (currentIndex != 0) {
      // Elige un elemento restante.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // Y cámbialo por el elemento actual.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  loadRecommendedProducts(): void {
    // 1. Obtiene todos los productos
    const allProducts = this.productService.getAllProductsList();
    
    // 2. Filtra el producto que ya está añadido
    const filteredProducts = allProducts.filter((p: any) => 
      p.id !== this.addedProduct.id
    );
    
    // 3. Baraja la lista filtrada
    let shuffledProducts = this.shuffleArray(filteredProducts);
    
    // 4. Toma los primeros 6 productos barajados
    this.recommendedProducts = shuffledProducts.slice(0, 6);
  }
  
  increaseQuantity(): void {
    this.cartService.updateItemQuantity(this.addedProduct.id, this.addedQuantity + 1);
  }

  decreaseQuantity(): void {
    if (this.addedQuantity > 1) {
      this.cartService.updateItemQuantity(this.addedProduct.id, this.addedQuantity - 1);
    }
  }

  onCloseDialog(): void {
    this.dialogRef.close('continue-shopping');
  }

  onGoToCart(): void {
    this.dialogRef.close('go-to-cart');
  }
}