import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-custom-paginator',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './custom-paginator.component.html',
  styleUrls: ['./custom-paginator.component.css']
})
export class CustomPaginatorComponent implements OnChanges {
  @Input() length: number = 0;
  @Input() pageSize: number = 12;
  @Output() pageChange = new EventEmitter<number>();
  currentPage: number = 1;
  totalPages: number = 0;
  pages: number[] = [];
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['length'] || changes['pageSize']) {
      this.calculatePages();
    }
  }
  private calculatePages(): void {
    this.totalPages = Math.ceil(this.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChange.emit(this.currentPage);
    }
  }
  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }
  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }
}