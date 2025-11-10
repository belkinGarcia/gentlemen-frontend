import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
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
  allProducts: any[] = [];
  categories: string[] = [];
  brands: string[] = [];
  selectedCategory: string | null = null;
  selectedBrand: string | null = null;
  products: any[] = [];
  totalProducts = 0;
  pageSize = 12;
  currentPage = 1;
  constructor(
    private productService: ProductService,
    private uiStateService: UiStateService
  ) {}
  ngOnInit(): void {
    this.uiStateService.setHeroState({
      type: 'banner',
      title: 'TIENDA',
      imageUrl: 'https://cdn.midjourney.com/c0d03bc8-50cc-4dc3-9199-1abd30f85020/0_0.png'
    });
    this.allProducts = this.productService.getAllProductsList();
    this.buildFilters();
    this.loadProducts();
  }
  buildFilters(): void {
    const categorySet = new Set<string>(this.allProducts.map(p => p.category));
    const brandSet = new Set<string>(this.allProducts.map(p => p.brand));
    this.categories = [...categorySet].sort();
    this.brands = [...brandSet].sort();
  }
  loadProducts(): void {
    let filteredProducts = this.allProducts;
    if (this.selectedCategory) {
      filteredProducts = filteredProducts.filter(p => p.category === this.selectedCategory);
    }
    if (this.selectedBrand) {
      filteredProducts = filteredProducts.filter(p => p.brand === this.selectedBrand);
    }
    this.totalProducts = filteredProducts.length;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.products = filteredProducts.slice(startIndex, endIndex);
  }
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }
  /**
   * Filtra la lista por una categoría.
   * Si se pasa 'null', se limpia el filtro.
   */
  selectCategory(category: string | null): void {
    this.selectedCategory = category;
    this.selectedBrand = null;
    this.currentPage = 1;
    this.loadProducts();
  }
  /**
   * Filtra la lista por una marca.
   * Si se pasa 'null', se limpia el filtro.
   */
  selectBrand(brand: string | null): void {
    this.selectedBrand = brand;
    this.selectedCategory = null;
    this.currentPage = 1;
    this.loadProducts();
  }
}