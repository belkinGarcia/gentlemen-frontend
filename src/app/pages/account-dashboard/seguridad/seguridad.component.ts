import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');
  if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
    return { passwordsMismatch: true };
  }
  return null;
}
@Component({
  selector: 'app-seguridad',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './seguridad.component.html',
  styleUrls: ['./seguridad.component.css']
})
export class SeguridadComponent {
  passwordForm: FormGroup;
  hideCurrent = true;
  hideNew = true;
  hideConfirm = true;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  constructor(private fb: FormBuilder, private authService: AuthService) {

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: passwordMatchValidator
    });
  }
updatePassword(): void {
    this.successMessage = null;
    this.errorMessage = null;

    if (this.passwordForm.valid) {
      const { currentPassword, newPassword } = this.passwordForm.value;

      // LLAMADA REAL AL BACKEND
      this.authService.changePassword(currentPassword, newPassword).subscribe({
        next: (response) => {
          console.log("Contraseña cambiada en BD:", response);
          this.successMessage = '¡Contraseña actualizada con éxito!';
          this.passwordForm.reset();
          
          // Limpiar errores visuales del formulario
          Object.keys(this.passwordForm.controls).forEach(key => {
            this.passwordForm.get(key)?.setErrors(null);
          });
        },
        error: (err) => {
          console.error("Error cambiando contraseña", err);
          // Si el backend devuelve "La contraseña actual es incorrecta"
          if (err.error && err.error.error) {
             this.errorMessage = err.error.error;
          } else {
             this.errorMessage = "Error al actualizar. Verifica tu contraseña actual.";
          }
        }
      });
    }
  }
  get confirmPasswordControl() {
    return this.passwordForm.get('confirmPassword');
  }
  get passwordMismatchError() {
    return this.passwordForm.errors?.['passwordsMismatch'] && 
           this.confirmPasswordControl?.touched;
  }
}