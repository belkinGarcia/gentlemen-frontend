import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  successMessage: string | null = null;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      phone: ['', Validators.required],
      dni: [{ value: '', disabled: true }],
      district: ['']
    });
  }
  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.profileForm.patchValue(currentUser);
    }
  }
  saveChanges(): void {
    this.successMessage = null;
    if (this.profileForm.valid) {
      console.log('Guardando cambios:', this.profileForm.getRawValue());
      this.authService.updateUser(this.profileForm.getRawValue()).subscribe({
        next: (updatedUser) => {
          console.log("Perfil actualizado con éxito", updatedUser);
          this.successMessage = "¡Tu perfil ha sido actualizado!";
        },
        error: (err) => {
          console.error("Error al actualizar perfil", err);
        }
      });
    }
  }
}