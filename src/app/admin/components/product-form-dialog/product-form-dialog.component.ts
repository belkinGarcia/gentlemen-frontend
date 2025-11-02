// src/app/admin/components/product-form-dialog/product-form-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './product-form-dialog.component.html',
  styleUrls: ['./product-form-dialog.component.css']
})
export class ProductFormDialogComponent {

  productForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // 'data' es el producto que pasamos
  ) {
    this.isEditMode = !!this.data; // Si hay 'data', estamos en modo "Editar"

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      imageUrl: ['', Validators.required],
      description: ['']
    });

    // Si es modo "Editar", rellena el formulario con los datos del producto
    if (this.isEditMode) {
      this.productForm.patchValue(this.data);
    }
  }

  onSave(): void {
    if (this.productForm.valid) {
      // Cierra el diálogo y devuelve los datos del formulario
      this.dialogRef.close(this.productForm.value);
    }
  }

  onCancel(): void {
    // Cierra el diálogo sin devolver nada
    this.dialogRef.close();
  }
}