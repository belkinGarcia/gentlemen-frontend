import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

// Importar los componentes y servicios necesarios
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { InfoSectionComponent } from '../../components/info-section/info-section.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';
import { ProductService } from '../../services/product.service';
import { UiStateService } from '../../services/ui-state.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    ProductListComponent,
    InfoSectionComponent,
    TestimonialsComponent
  ],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  // --- Propiedades para el Menú ---
  menuItems = [
    {
      name: 'Categoría',
      children: [
        { name: 'Lavado y cuidado de cabello' },
        { name: 'Promociones' },
        { name: 'Afeitado' },
        { name: 'Crecimiento y cuidado de barba' },
      ]
    },
    {
      name: 'Marca',
      children: [
        { name: 'American Crew' },
        { name: 'MUK' },
        { name: 'The Barber Company' },
        { name: 'Vikingo' }
      ]
    }
  ];
  activeSubItems: string[] = [];
  activeMenuName: string = '';

  // --- Propiedades para la Paginación ---
  products: any[] = [];
  totalProducts = 0;
  pageSize = 12;
  currentPage = 1;

  // Inyectamos los servicios en el constructor
  constructor(
    private productService: ProductService,
    private uiStateService: UiStateService
  ) {}

  // Al iniciar, configuramos el banner y cargamos los productos
ngOnInit(): void {
  this.uiStateService.setHeroState({
    type: 'banner',
    title: 'TIENDA', // The title for the shop page banner
    imageUrl: 'https://cdn.midjourney.com/c0d03bc8-50cc-4dc3-9199-1abd30f85020/0_0.png' // A relevant background image
  });
  this.loadProducts();
}

  // Carga los productos para la página actual
  loadProducts(): void {
    const pageData = this.productService.getProducts(this.currentPage, this.pageSize);
    this.products = pageData.products;
    this.totalProducts = pageData.totalProducts;
  }

  // Se activa al cambiar de página
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }
  
  // --- Métodos para el Menú ---
  showSubItems(item: any): void {
    this.activeSubItems = item.children.map((child: any) => child.name);
    this.activeMenuName = item.name;
  }

  clearSubItems(): void {
    this.activeSubItems = [];
    this.activeMenuName = '';
  }
}