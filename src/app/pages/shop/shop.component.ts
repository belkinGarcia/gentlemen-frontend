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
  
  // --- Propiedades para el Menú (AHORA DINÁMICAS) ---
  allProducts: any[] = []; // Almacenará todos los productos
  categories: string[] = []; // Lista única de categorías
  brands: string[] = []; // Lista única de marcas

  // --- Propiedades para el Filtro ---
  selectedCategory: string | null = null;
  selectedBrand: string | null = null;

  // --- Propiedades para la Paginación ---
  products: any[] = []; // Productos para la página actual
  totalProducts = 0; // Total de productos *después* de filtrar
  pageSize = 12;
  currentPage = 1;

  // Inyectamos los servicios en el constructor
  constructor(
    private productService: ProductService,
    private uiStateService: UiStateService
  ) {}

  // Al iniciar, configuramos el banner, cargamos TODOS los productos y construimos los filtros
  ngOnInit(): void {
    this.uiStateService.setHeroState({
      type: 'banner',
      title: 'TIENDA', // The title for the shop page banner
      imageUrl: 'https://cdn.midjourney.com/c0d03bc8-50cc-4dc3-9199-1abd30f85020/0_0.png' // A relevant background image
    });
    
    // 1. Carga todos los productos para construir los filtros
    this.allProducts = this.productService.getAllProductsList();
    
    // 2. Construye los filtros
    this.buildFilters();
    
    // 3. Carga la primera página de productos (sin filtro)
    this.loadProducts();
  }

  // Extrae categorías y marcas únicas de la lista de productos
  buildFilters(): void {
    // Usamos Set para obtener valores únicos automáticamente
    const categorySet = new Set<string>(this.allProducts.map(p => p.category));
    const brandSet = new Set<string>(this.allProducts.map(p => p.brand));

    // Convertimos los Sets de nuevo a arrays
    this.categories = [...categorySet].sort();
    this.brands = [...brandSet].sort();
  }

  // Carga los productos para la página actual, aplicando filtros
  loadProducts(): void {
    let filteredProducts = this.allProducts;

    // 1. Aplicar filtro de categoría si existe
    if (this.selectedCategory) {
      filteredProducts = filteredProducts.filter(p => p.category === this.selectedCategory);
    }
    
    // 2. Aplicar filtro de marca si existe
    if (this.selectedBrand) {
      filteredProducts = filteredProducts.filter(p => p.brand === this.selectedBrand);
    }

    // 3. Actualizar el total de productos (para la paginación)
    this.totalProducts = filteredProducts.length;

    // 4. Aplicar paginación a la lista filtrada
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.products = filteredProducts.slice(startIndex, endIndex);
  }

  // Se activa al cambiar de página
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }
  
  // --- Métodos para el Menú de Filtro ---

  /**
   * Filtra la lista por una categoría.
   * Si se pasa 'null', se limpia el filtro.
   */
  selectCategory(category: string | null): void {
    this.selectedCategory = category;
    this.selectedBrand = null; // Solo permitimos un filtro a la vez
    this.currentPage = 1; // Reseteamos a la página 1
    this.loadProducts();
  }

  /**
   * Filtra la lista por una marca.
   * Si se pasa 'null', se limpia el filtro.
   */
  selectBrand(brand: string | null): void {
    this.selectedBrand = brand;
    this.selectedCategory = null; // Solo permitimos un filtro a la vez
    this.currentPage = 1; // Reseteamos a la página 1
    this.loadProducts();
  }
}