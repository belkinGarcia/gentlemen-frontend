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
import { CustomPaginatorComponent } from '../custom-paginator/custom-paginator.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule, ProductCardComponent, MatIconModule, MatButtonModule,
    RouterModule, MatToolbarModule, MatMenuModule, MatFormFieldModule, MatInputModule,
    CustomPaginatorComponent, MatPaginatorModule
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
  @Input() showTitle: boolean = true;
  @Input() showViewAllButton: boolean = true;
  @Input() showNav: boolean = false;
  @Output() pageChange = new EventEmitter<number>();
  currentIndex = 0;
  get maxIndex(): number {
    const visibleSlides = 3; 
    if (this.products.length <= visibleSlides) {
      return 0;
    }
    return this.products.length - visibleSlides;
  }
  constructor() {}
  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }
  next(): void {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
    }
  }
  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
}