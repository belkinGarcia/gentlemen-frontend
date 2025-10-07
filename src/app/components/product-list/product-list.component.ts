import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CustomPaginatorComponent } from '../custom-paginator/custom-paginator.component'; // Importación correcta
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'; // 1. Import this module


// PageEvent y MatPaginatorModule ya no son necesarios
// import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule, ProductCardComponent, MatIconModule, MatButtonModule,
    RouterModule, MatToolbarModule, MatMenuModule, MatFormFieldModule, MatInputModule,
    CustomPaginatorComponent, MatPaginatorModule // Se usa el paginador personalizado
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  @Input() showFilterBar: boolean = true;
  @Input() isCarousel: boolean = false;
  @Input() products: any[] = [];
  @Input() totalProducts: number = 0;
  @Input() pageSize: number = 8;
  
  // El evento ahora emite un número (el número de página)
  @Output() pageChange = new EventEmitter<number>();

  currentIndex = 0;

  constructor() {}

  // El método ahora recibe un número
  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }

  // Lógica del carrusel (sin cambios)
  next(): void {
    const visibleSlides = 3;
    const maxIndex = this.products.length > visibleSlides ? this.products.length - visibleSlides : 0;
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
    }
  }

  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
}