import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select'; // IMPORTANTE
import { MatIconModule } from '@angular/material/icon'; // IMPORTANTE
import { Service, ServiceService, Category } from '../../../services/service.service';

@Component({
  selector: 'app-service-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './service-form-dialog.component.html',
  styleUrls: ['./service-form-dialog.component.css']
})
export class ServiceFormDialogComponent implements OnInit {
  serviceForm: FormGroup;
  isEditMode: boolean;
  categories: Category[] = []; // Lista para el dropdown

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ServiceFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Service,
    private serviceService: ServiceService
  ) {
    this.isEditMode = !!this.data;

    this.serviceForm = this.fb.group({
      id: [this.data ? this.data.id : null],
      name: [this.data ? this.data.name : '', Validators.required],
      price: [this.data ? this.data.price : '', [Validators.required, Validators.min(0)]],
      duration: [this.data ? this.data.duration : 30, [Validators.required, Validators.min(10)]],
      description: [this.data ? this.data.description : ''],
      idTipoServicio: ['', Validators.required],
      imageUrl: [this.data ? this.data.imageUrl : '']
    });
  }

  ngOnInit(): void {
    this.serviceService.categories$.subscribe(cats => {
      this.categories = cats;

      if (this.isEditMode && this.data) {
        const parentCategory = this.categories.find(cat =>
          cat.items.some(item => item.id === this.data.id)
        );

        if (parentCategory) {
          this.serviceForm.patchValue({
            idTipoServicio: parentCategory.idTipoServicio
          });
        }
      }
    });
  }

  onSave(): void {
    if (this.serviceForm.valid) {
      // Devolvemos el objeto completo incluyendo el ID de la categoría
      this.dialogRef.close(this.serviceForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
