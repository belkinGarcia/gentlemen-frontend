import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { forkJoin } from 'rxjs';

import { CategoryService } from '../../../services/category.service';
import { BrandService } from '../../../services/brand.service';

@Component({
  selector: 'app-product-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './product-form-dialog.component.html',
  styleUrls: ['./product-form-dialog.component.css']
})
export class ProductFormDialogComponent implements OnInit {
  productForm: FormGroup;
  isEditMode: boolean;

  categories: any[] = [];
  brands: any[] = [];
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private categoryService: CategoryService,
    private brandService: BrandService
  ) {
    this.isEditMode = !!this.data;

    // Inicializamos el formulario con los nuevos campos
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      brandId: [null, Validators.required],
      categoryId: [null, Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [10, [Validators.required, Validators.min(0)]],
      imagenUrl: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    // 4. CARGA SIMULTÁNEA (ForkJoin)
    // Esperamos a que carguen Categorías Y Marcas antes de poner los valores
    forkJoin({
      cats: this.categoryService.getAll(),
      brands: this.brandService.getAll()
    }).subscribe({
      next: (response) => {
        this.categories = response.cats;
        this.brands = response.brands; // Guardamos las marcas

        // Una vez cargadas las listas, llenamos el formulario si es edición
        if (this.isEditMode && this.data) {
          this.productForm.patchValue({
            name: this.data.name,
            price: this.data.price,
            stock: this.data.stock,
            imagenUrl: this.data.imagenUrl || this.data.imageUrl,
            description: this.data.description,

            // Mapeamos los Objetos anidados a sus IDs
            categoryId: this.data.categoria ? this.data.categoria.idCategoria : null,
            brandId: this.data.marca ? this.data.marca.idMarca : null
          });
        }
      },
      error: (err) => console.error('Error cargando listas', err)
    });
  }

  onSave(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;

      // 5. CONSTRUIR EL OBJETO PARA EL BACKEND
      const productPayload = {
        name: formValue.name,
        price: formValue.price,
        stock: formValue.stock,
        imagenUrl: formValue.imagenUrl,
        description: formValue.description,

        // Enviamos el objeto Categoria completo con su ID
        categoria: {
          idCategoria: formValue.categoryId
        },

        // Enviamos el objeto Marca completo con su ID
        marca: {
          idMarca: formValue.brandId
        }
      };

      this.dialogRef.close(productPayload);
    }
  }
  onCancel(): void {
    this.dialogRef.close();
  }
}
