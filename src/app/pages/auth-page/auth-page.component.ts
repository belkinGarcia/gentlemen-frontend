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
import { AuthService } from '../../services/auth.service';
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
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  hidePassword = true;
  @Output() loginSuccess = new EventEmitter<any>();
  @Output() registerSuccess = new EventEmitter<any>();
  @Input() displayMode: 'tabs' | 'grid' = 'grid';
  activeView: 'register' | 'login' = 'register';
  @HostBinding('class.tabs-mode') get isTabsMode() {
    return this.displayMode === 'tabs';
  }
  @HostBinding('class.grid-mode') get isGridMode() {
    return this.displayMode === 'grid';
  }
  constructor(
    private fb: FormBuilder,
    private uiStateService: UiStateService,
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
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
      phone: [''],
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
  onSubmitLogin(): void {
    if (this.loginForm.valid) {
      const loginPayload = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };
      this.authService.login(loginPayload).subscribe({
        next: response => {
          console.log('Respuesta del login:', response);
          if (this.displayMode === 'grid') {
            this.router.navigate(['/']); 
          } else {
            this.loginSuccess.emit(response.user);
          }
        },
        error: error => console.error('Error al realizar login:', error)
      });
    }
  }
onSubmitRegister(): void {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      
      // AQUÍ ESTÁ LA MAGIA: Traducimos del Formulario al Backend
      const registerPayload = {
        // Backend (Usuario.java)  <--  Frontend (Formulario)
        firstName: formData.firstName, // Antes decía 'nombres', debe ser 'firstName'
        lastName: formData.lastName,   // Antes decía 'apellidos', debe ser 'lastName'
        dni: formData.dni,
        email: formData.email,
        password: formData.password,   // Correcto (coincide con RegisterRequest)
        phone: formData.phone,     // Java espera 'celular', no 'phone'
        
        // IMPORTANTE: Tu controlador revisa el tipo de usuario para crear la tabla Cliente
        // Si no envías esto, la base de datos dará error (nullable=false)
        tipoUsuario: 'CLIENTE'         
      };

      this.authService.register(registerPayload).subscribe({
        next: response => {
          console.log('Respuesta del registro:', response);
          if (this.displayMode === 'grid') {
            alert('¡Registro exitoso! Por favor, inicia sesión.');
            this.setActiveView('login');
          } else {
            this.registerSuccess.emit(response); // Emitimos la respuesta completa
            this.setActiveView('login');
          }
        },
        error: error => console.error('Error al realizar registro:', error)
      });
    }
  }
  setActiveView(view: 'register' | 'login'): void {
    this.activeView = view;
  }
}