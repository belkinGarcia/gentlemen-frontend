import { Component, OnInit } from '@angular/core';
import { UiStateService } from '../../services/ui-state.service';
import { ProductService } from '../../services/product.service';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { InfoSectionComponent } from '../../components/info-section/info-section.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';
import { VideoCtaComponent } from '../../components/video-cta/video-cta.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductListComponent, InfoSectionComponent, TestimonialsComponent, VideoCtaComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  homeProducts: any[] = [];
  constructor(
    private uiStateService: UiStateService,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    this.uiStateService.setHeroState({ type: 'carousel' });
    this.homeProducts = this.productService.getProducts(1, 8).products;
  }
}