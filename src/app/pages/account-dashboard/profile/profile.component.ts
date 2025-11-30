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
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: '', disabled: true }], // El email suele ser único, mejor no editarlo aquí
      phone: ['', Validators.required],
      dni: [{ value: '', disabled: true }]    // El DNI no se debe cambiar
      // district: [''] <--- ELIMINADO
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      // Mapeo inverso: De lo que hay en localStorage al Formulario
      this.profileForm.patchValue({
        firstName: currentUser.firstName || currentUser.nombres,
        lastName: currentUser.lastName || currentUser.apellidos,
        email: currentUser.email || currentUser.correo,
        phone: currentUser.phone || currentUser.celular,
        dni: currentUser.dni
      });
    }
  }

  saveChanges(): void {
    this.successMessage = null;
    this.errorMessage = null;

    if (this.profileForm.valid) {
      const formData = this.profileForm.getRawValue();

      // TRADUCCIÓN: Frontend (Inglés) -> Backend (Español)
      // Esto es lo que enviaremos a UsuarioController.java
      const updatePayload = {
        nombres: formData.firstName,
        apellidos: formData.lastName,
        celular: formData.phone,
        dni: formData.dni,
        email: formData.email,
        // No enviamos contraseña para que el backend la ignore y la mantenga
        contrasena: null 
      };

      console.log('Enviando actualización:', updatePayload);

      this.authService.updateUser(updatePayload).subscribe({
        next: (updatedUser) => {
          this.successMessage = "¡Tu perfil ha sido actualizado correctamente!";
          // Opcional: Ocultar mensaje después de 3 seg
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (err) => {
          console.error("Error al actualizar perfil", err);
          this.errorMessage = "Hubo un error al guardar los cambios.";
        }
      });
    }
  }
}