import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CategoryService, Categoria } from '../../../services/category.service';
import { CategoryFormDialogComponent } from '../../components/category-form-dialog/category-form-dialog.component';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css']
})
export class CategoryManagementComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'actions'];
  dataSource: Categoria[] = [];

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => this.dataSource = data,
      error: (e) => console.error('Error cargando categorías', e)
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CategoryFormDialogComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.create(result).subscribe(() => {
          this.loadCategories(); // Recargar tabla
        });
      }
    });
  }

  openEditDialog(category: Categoria): void {
    const dialogRef = this.dialog.open(CategoryFormDialogComponent, {
      width: '400px',
      data: category
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && category.idCategoria) {
        this.categoryService.update(category.idCategoria, result).subscribe(() => {
          this.loadCategories();
        });
      }
    });
  }

  deleteCategory(id: number): void {
    if (confirm('¿Seguro que deseas eliminar esta categoría?')) {
      this.categoryService.delete(id).subscribe(() => {
        this.loadCategories();
      });
    }
  }
}