import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider'; 
import { LocationService, Location } from '../../../services/location.service';
interface DialogData {
  id?: number;
  name?: string;
  locationId?: number;
  imageUrl?: string;
  bio?: string;
  isActive?: boolean;
  rating?: number;
  dayOff?: string;
  shift?: string;
}
@Component({
  selector: 'app-barber-form-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatSelectModule, 
    MatCheckboxModule,
    MatDividerModule
  ],
  templateUrl: './barber-form-dialog.component.html',
  styleUrls: ['./barber-form-dialog.component.css']
})
export class BarberFormDialogComponent implements OnInit {
  barberForm: FormGroup;
  daysOfWeek: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo', 'Ninguno'];
  shifts: string[] = ['Full Time', 'Part Time - Mañana', 'Part Time - Tarde'];
  locations: Location[] = [];
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BarberFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private locationService: LocationService
  ) {
    this.barberForm = this.fb.group({
      id: [this.data ? this.data.id : null],
      name: [this.data ? this.data.name : '', Validators.required],
      locationId: [this.data ? this.data.locationId : '', Validators.required],
      imageUrl: [this.data ? this.data.imageUrl : ''],
      bio: [this.data ? this.data.bio : ''],
      isActive: [this.data ? this.data.isActive : true],
      rating: [this.data ? this.data.rating : 5.0],
      dayOff: [this.data?.dayOff || 'Domingo', Validators.required],
      shift: [this.data?.shift || 'Full Time', Validators.required]
    });
    if (this.data) {
      this.barberForm.patchValue(this.data);
    }
  }
  ngOnInit(): void {
    this.locations = this.locationService.getLocations();
  }
  onSave(): void {
    if (this.barberForm.valid) {
      const result = this.data ? { ...this.barberForm.value, id: this.data.id } : this.barberForm.value;
      this.dialogRef.close(result);
    }
  }
  onCancel(): void {
    this.dialogRef.close();
  }
}