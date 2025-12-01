import { Component, OnInit, EventEmitter, Output, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { UiStateService } from '../../services/ui-state.service';
// IMPORTANTE: Usamos AuthService para el login, no solo UserService
import { AuthService } from '../../services/auth.service';
import { UserService, Usuario } from '../../services/user.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCheckboxModule, MatIconModule, RouterModule
  ],
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.css']
})
export class AuthPageComponent implements OnInit {
  errorMessage: string = '';
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  hidePassword = true;

  @Output() loginSuccess = new EventEmitter<any>();
  @Output() registerSuccess = new EventEmitter<any>();
  @Input() displayMode: 'tabs' | 'grid' = 'grid';
  
  activeView: 'register' | 'login' = 'login'; 

  @HostBinding('class.tabs-mode') get isTabsMode() { return this.displayMode === 'tabs'; }
  @HostBinding('class.grid-mode') get isGridMode() { return this.displayMode === 'grid'; }

  constructor(
    private authService: AuthService, // <--- INYECTAMOS AUTH SERVICE
    private userService: UserService, // Mantenemos este para el registro si quieres
    private fb: FormBuilder,
    private uiStateService: UiStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required], // Quitamos validación de email para permitir DNI
      password: ['', Validators.required],
      rememberMe: [false]
    });

    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dni: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      phone: ['', Validators.required],
      district: [''],
      terms: [false, Validators.requiredTrue]
    });

    if (this.displayMode === 'grid') {
      this.uiStateService.setHeroState({
        type: 'banner',
        title: 'MI CUENTA',
        imageUrl: 'https://cdn.midjourney.com/c0d03bc8-50cc-4dc3-9199-1abd30f85020/0_0.png'
      });
    }
  }

  // --- LOGIN CORREGIDO ---
  onSubmitLogin(): void {
    if (this.loginForm.valid) {
      const credentials = {
        email: this.loginForm.value.username, // El backend espera 'email' aunque mandes DNI
        password: this.loginForm.value.password
      };

      // CAMBIO CLAVE: Usamos authService.login()
      // Este método ya se encarga de guardar 'user_role' y 'auth_token' en localStorage
      this.authService.login(credentials).subscribe({
        next: (response) => { 
          // La respuesta ya viene procesada por el AuthService (tap)
          // El AuthService ya guardó la sesión, así que solo verificamos el rol aquí.
          
          // Recuperamos el usuario guardado para ver su rol y redirigir
          const user = this.authService.getCurrentUser();
          
          if (this.displayMode === 'grid') {
            if (this.authService.isAdmin()) {
              console.log('Redirigiendo a Admin...');
              this.router.navigate(['/admin']);
            } else {
              console.log('Redirigiendo a Mi Cuenta...');
              this.router.navigate(['/mi-cuenta']);
            }
          } else {
            this.loginSuccess.emit(user);
          }
        },
        error: error => {
          console.error('Error login:', error);
          this.errorMessage = 'Credenciales incorrectas o usuario no encontrado.';
        }
      });
    }
  }

  onSubmitRegister(): void {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      
      if (formData.password !== formData.confirmPassword) {
        this.errorMessage = 'Las contraseñas no coinciden.';
        return;
      }

      const usuarioParaBackend: Usuario = {
        nombres: formData.firstName,
        apellidos: formData.lastName,
        dni: formData.dni,
        email: formData.email,
        celular: formData.phone,
        contrasena: formData.password,
        tipoUsuario: 'CLIENTE'
      };

      this.userService.register(usuarioParaBackend).subscribe({
        next: (user: Usuario) => {
          // AUTO-LOGIN TRAS REGISTRO
          const credentials = {
            email: formData.dni, 
            password: formData.password
          };

          this.authService.login(credentials).subscribe({
            next: () => {
              if (this.displayMode === 'grid') {
                 this.router.navigate(['/mi-cuenta']);
              } else {
                 this.registerSuccess.emit(user);
              }
            }
          });
        },
        error: error => {
          console.error('Error registro:', error);
          this.errorMessage = 'Error al registrar. Verifica datos duplicados.';
        }
      });
    } else {
      this.errorMessage = 'Completa todos los campos.';
    }
  }

  setActiveView(view: 'register' | 'login'): void {
    this.activeView = view;
    this.errorMessage = '';
  }
}