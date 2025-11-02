// src/app/admin/components/location-form-dialog/location-form-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Location } from '../../../services/location.service'; // Importa la interfaz

@Component({
  selector: 'app-location-form-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, 
    MatInputModule, MatButtonModule, MatDividerModule
  ],
  templateUrl: './location-form-dialog.component.html',
  styleUrls: ['./location-form-dialog.component.css']
})
export class LocationFormDialogComponent {

  locationForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LocationFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Location // Datos de la sede
  ) {
    this.isEditMode = !!this.data;

    this.locationForm = this.fb.group({
      id: [this.data ? this.data.id : null],
      name: [this.data ? this.data.name : '', Validators.required],
      address: [this.data ? this.data.address : '', Validators.required],
      phone: [this.data ? this.data.phone : '', Validators.required],
      imageUrl: [this.data ? this.data.imageUrl : ''],
      mapLink: [this.data ? this.data.mapLink : '']
    });

    if (this.isEditMode) {
      this.locationForm.patchValue(this.data);
    }
  }

  onSave(): void {
    if (this.locationForm.valid) {
      // Asegura que el ID se devuelva si estamos editando
      const result = this.isEditMode ? { ...this.locationForm.value, id: this.data.id } : this.locationForm.value;
      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}