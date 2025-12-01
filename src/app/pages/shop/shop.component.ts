import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { Subscription, combineLatest } from 'rxjs';

// 1. IMPORTAR SERVICIOS DE CATEGORÍA Y MARCA
import { CategoryService } from '../../services/category.service';
import { BrandService } from '../../services/brand.service';

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
export class ShopComponent implements OnInit, OnDestroy {
  allProducts: any[] = [];

  // Listas para los filtros
  categories: string[] = [];
  brands: string[] = [];

  selectedCategory: string | null = null;
  selectedBrand: string | null = null;

  products: any[] = [];
  totalProducts = 0;
  pageSize = 12;
  currentPage = 1;

  private dataSub: Subscription | undefined;

  constructor(
    private productService: ProductService,
    private uiStateService: UiStateService,
    // 2. INYECTAR SERVICIOS
    private categoryService: CategoryService,
    private brandService: BrandService
  ) {}

  ngOnInit(): void {
    this.uiStateService.setHeroState({
      type: 'banner',
      title: 'TIENDA',
      imageUrl: 'https://cdn.midjourney.com/c0d03bc8-50cc-4dc3-9199-1abd30f85020/0_0.png'
    });

    // 3. CARGAR TODO AL MISMO TIEMPO (Productos + Categorías + Marcas)
    this.dataSub = combineLatest([
      this.productService.products$, // Productos (en vivo)
      this.categoryService.getAll(), // Categorías (DB)
      this.brandService.getAll()     // Marcas (DB)
    ]).subscribe(([products, categoriesDB, brandsDB]) => {

      this.allProducts = products;

      this.categories = categoriesDB.map(c => c.nombre).sort();

      // Asignamos las marcas directamente de la base de datos
      this.brands = brandsDB.map(b => b.nombre).sort();

      // Cargamos la lista filtrada inicial
      this.loadProducts();
    });
  }

  ngOnDestroy(): void {
    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
  }

  loadProducts(): void {
    let filteredProducts = this.allProducts;

    // 1. Filtro por Categoría (Robustecido)
    if (this.selectedCategory) {
      filteredProducts = filteredProducts.filter(p => {
        const catVal = p.categoria || p.category;

        const catName = (catVal && typeof catVal === 'object') ? catVal.nombre : catVal;

        return (catName || 'Otros') === this.selectedCategory;
      });
    }

    // 2. Filtro por Marca (CORREGIDO)
    if (this.selectedBrand) {
      filteredProducts = filteredProducts.filter(p => {
        const brandVal = p.marca || p.brand;

        const brandName = (brandVal && typeof brandVal === 'object')
                          ? brandVal.nombre
                          : brandVal;

        return (brandName || 'Genérico') === this.selectedBrand;
      });
    }

  // Paginación normal
  this.totalProducts = filteredProducts.length;
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.products = filteredProducts.slice(startIndex, endIndex);
}

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  selectCategory(category: string | null): void {
    this.selectedCategory = category;
    this.selectedBrand = null; // Resetear marca al cambiar categoría (opcional)
    this.currentPage = 1;
    this.loadProducts();
  }

  selectBrand(brand: string | null): void {
    this.selectedBrand = brand;
    this.selectedCategory = null; // Resetear categoría al cambiar marca (opcional)
    this.currentPage = 1;
    this.loadProducts();
  }
}
