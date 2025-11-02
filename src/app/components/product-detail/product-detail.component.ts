import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { UiStateService } from '../../services/ui-state.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { InfoSectionComponent } from "../info-section/info-section.component";
import { TestimonialsComponent } from "../testimonials/testimonials.component";
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddToCartDialogComponent } from '../add-to-cart-dialog/add-to-cart-dialog';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule, 
    MatIconModule, 
    ProductListComponent, 
    InfoSectionComponent,
    TestimonialsComponent,
    FormsModule,
    MatDialogModule // Añade MatDialogModule aquí
],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: any;
  relatedProducts: any[] = [];
  
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private productService: ProductService,
    private uiStateService: UiStateService,
    private cartService: CartService,
    private dialog: MatDialog 
  ) {}

  ngOnInit(): void {
    // ... (tu lógica de ngOnInit no cambia) ...
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.product = this.productService.getProductById(+productId);
        
        if (this.product) {
          this.uiStateService.setHeroState({
            type: 'banner',
            title: this.product.name,
            imageUrl: '	https://cdn.midjourney.com/c0d03bc8-50cc-4dc3-9199-1abd30f85020/0_0.png'
          });

          const allProducts = this.productService.getAllProductsList();
          this.relatedProducts = allProducts
            .filter((p: any) => p.category === this.product.category && p.id !== this.product.id)
            .slice(0, 4);
        }
      }
    });
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) return;
    
    this.cartService.addToCart(this.product, this.quantity);
    
    const dialogRef = this.dialog.open(AddToCartDialogComponent, {
      width: '90%',
      maxWidth: '900px',
      // === CAMBIO AQUÍ ===
      // Solo pasamos el producto. El diálogo obtendrá la
      // cantidad real directamente del servicio.
      data: { product: this.product }, 
      panelClass: 'dark-theme-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'go-to-cart') {
        this.router.navigate(['/carrito']);
      }
    });
  }
}