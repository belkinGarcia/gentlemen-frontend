import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { UiStateService } from '../../services/ui-state.service';
// --- Nuevas importaciones ---
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { InfoSectionComponent } from "../info-section/info-section.component";
import { TestimonialsComponent } from "../testimonials/testimonials.component";

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule, // <-- Añadir
    MatIconModule, // <-- Añadir
    ProductListComponent, // <-- Añadir para reutilizarlo
    InfoSectionComponent,
    TestimonialsComponent
],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: any;
  relatedProducts: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private uiStateService: UiStateService // 2. Inyecta el servicio
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.product = this.productService.getProductById(+productId);

        // 3. Cuando encontramos el producto, establecemos el estado del banner
        if (this.product) {
          this.uiStateService.setHeroState({
            type: 'banner',
            title: this.product.name,
            // URL de imagen genérica para el banner, puedes cambiarla
            imageUrl: 'https://cdn.midjourney.com/c0d03bc8-50cc-4dc3-9199-1abd30f85020/0_0.png'
          });
                    // Fetch related products, excluding the current one
          this.relatedProducts = this.productService.getProducts(1, 5).products
            .filter(p => p.id !== this.product.id)
            .slice(0, 4); // Ensure we only show 4
        }
      }
    });
  }
}