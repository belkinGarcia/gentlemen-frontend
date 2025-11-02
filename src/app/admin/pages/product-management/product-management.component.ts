// src/app/admin/pages/product-management/product-management.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '../../../services/product.service';
import { ProductFormDialogComponent } from '../../components/product-form-dialog/product-form-dialog.component';
@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule // Importa MatDialogModule
  ],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['image', 'name', 'category', 'price', 'actions'];
  dataSource: any[] = [];
  private productSub: Subscription | undefined;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog // Para abrir el pop-up
  ) {}

  ngOnInit(): void {
    // Se suscribe al servicio para que la tabla se actualice sola
    this.productSub = this.productService.products$.subscribe(products => {
      this.dataSource = products;
    });
  }

  ngOnDestroy(): void {
    this.productSub?.unsubscribe();
  }

  /**
   * Abre el diálogo para crear un nuevo producto
   */
  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      width: '500px',
      data: null // 'null' significa modo "Crear"
    });

    dialogRef.afterClosed().subscribe(result => {
      // Si el diálogo se cerró con "Guardar" y devolvió datos
      if (result) {
        this.productService.createProduct(result);
      }
    });
  }

  /**
   * Abre el diálogo para editar un producto existente
   */
  openEditDialog(product: any): void {
    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      width: '500px',
      data: product // Pasa el producto para "Editar"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.updateProduct({ ...product, ...result });
      }
    });
  }

  /**
   * Llama al servicio para eliminar un producto
   */
  deleteProduct(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.productService.deleteProduct(id);
    }
  }
}