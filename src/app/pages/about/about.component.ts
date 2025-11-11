import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiStateService } from '../../services/ui-state.service';
import { ProductService } from '../../services/product.service';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';
import { InfoSectionComponent } from '../../components/info-section/info-section.component';
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    ProductListComponent,
    TestimonialsComponent,
    InfoSectionComponent
  ],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  previewProducts: any[] = [];
  constructor(
    private uiStateService: UiStateService,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    this.uiStateService.setHeroState({
      type: 'banner',
      title: 'NOSOTROS',
      imageUrl: 'https://cdn.midjourney.com/c0d03bc8-50cc-4dc3-9199-1abd30f85020/0_0.png'
    });
    this.previewProducts = this.productService.getProducts(1, 4).products;
  }
}