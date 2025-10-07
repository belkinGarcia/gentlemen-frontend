import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BarberService } from '../../services/barber.service';
import { UiStateService } from '../../services/ui-state.service';
import { ProductService } from '../../services/product.service';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { InfoSectionComponent } from '../../components/info-section/info-section.component';

@Component({
  selector: 'app-barber-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductListComponent, InfoSectionComponent],
  templateUrl: './barber-detail.component.html',
  styleUrls: ['./barber-detail.component.css']
})
export class BarberDetailComponent implements OnInit {
  barber: any;
  previewProducts: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private barberService: BarberService,
    private productService: ProductService,
    private uiStateService: UiStateService
  ) {}

  ngOnInit(): void {
    const barberId = this.route.snapshot.paramMap.get('id');
    if (barberId) {
      this.barber = this.barberService.getBarberById(+barberId);
      if (this.barber) {
        // Set the banner state
        this.uiStateService.setHeroState({
          type: 'banner',
          title: `BARBERO - ${this.barber.name.toUpperCase()}`,
          imageUrl: this.barber.imageUrl
        });
        // Fetch product preview
        this.previewProducts = this.productService.getProducts(1, 4).products;
      }
    }
  }
}