// src/app/admin/components/service-form-dialog/service-form-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Service, ServiceService, Category } from '../../../services/service.service'; // Importa Service y Category

@Component({
  selector: 'app-service-form-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, 
    MatInputModule, MatButtonModule, MatDividerModule
  ],
  templateUrl: './service-form-dialog.component.html',
  styleUrls: ['./service-form-dialog.component.css']
})
export class ServiceFormDialogComponent implements OnInit {

  serviceForm: FormGroup;
  isEditMode: boolean;
  
  // Propiedad para la categoría (no podemos usar un select sin un LocationService reactivo)
  categoryName: string = ''; 

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ServiceFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Service, // Puede ser Service o null
    private serviceService: ServiceService
  ) {
    this.isEditMode = !!this.data;

    this.serviceForm = this.fb.group({
      id: [this.data ? this.data.id : null],
      name: [this.data ? this.data.name : '', Validators.required],
      price: [this.data ? this.data.price : '', [Validators.required, Validators.min(0)]],
      // Campo crucial
      duration: [this.data ? this.data.duration : 30, [Validators.required, Validators.min(10)]], 
      description: [this.data ? this.data.description : ''],
      // Nota: La categoría debe manejarse aquí
      category: [this.data ? this.categoryName : '', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode) {
      // Si estamos editando, encuentra el nombre de la categoría del servicio
      const categories = this.serviceService.getServicesByCategory();
      const categoryEntry = categories.find(cat => cat.items.some(item => item.id === this.data.id));
      if (categoryEntry) {
        this.serviceForm.get('category')?.setValue(categoryEntry.category);
      }
    }
  }

  onSave(): void {
    if (this.serviceForm.valid) {
      // Devuelve todos los datos, incluida la categoría (para que el service la pueda manejar)
      this.dialogRef.close(this.serviceForm.value); 
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}