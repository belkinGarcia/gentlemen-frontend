import { Component, OnInit, EventEmitter, Output, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon'; // Import Icon Module
import { UiStateService } from '../../services/ui-state.service';

@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCheckboxModule, MatIconModule, RouterModule // Add Icon Module
  ],
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.css']
})
export class AccountPageComponent implements OnInit {
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  hidePassword = true; // For password visibility toggle

  @Output() loginSuccess = new EventEmitter<any>();
  @Output() registerSuccess = new EventEmitter<any>();
  @Input() displayMode: 'tabs' | 'grid' = 'grid';

    activeView: 'register' | 'login' = 'register';
  
  // 3. AÑADE HOSTBINDING: Esto agrega una clase CSS al componente mismo
  // para que podamos aplicar estilos diferentes desde afuera.
  @HostBinding('class.tabs-mode') get isTabsMode() {
    return this.displayMode === 'tabs';
  }
  @HostBinding('class.grid-mode') get isGridMode() {
    return this.displayMode === 'grid';
  }

  constructor(
    private fb: FormBuilder,
    private uiStateService: UiStateService
  ) {}

  ngOnInit(): void {
    this.uiStateService.setHeroState({
      type: 'banner',
      title: 'MI CUENTA',
      imageUrl: 'https://cdn.midjourney.com/c0d03bc8-50cc-4dc3-9199-1abd30f85020/0_0.png'
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
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
  }

  onSubmitLogin(): void {
    if (this.loginForm.valid) {
      console.log('Login exitoso en AccountPage:', this.loginForm.value);
      // 3. Emite el evento con los datos del formulario
      // En un caso real, esto iría dentro de la respuesta exitosa de tu servicio de autenticación
      this.loginSuccess.emit(this.loginForm.value);
    }
  }
 onSubmitRegister(): void {
    if (this.registerForm.valid) {
      console.log('Registro exitoso en AccountPage:', this.registerForm.value);
      // 4. Emite el evento con los datos del formulario
      // En un caso real, esto iría después de que el API confirme el registro
      this.registerSuccess.emit(this.registerForm.value);
    }
  }
   setActiveView(view: 'register' | 'login'): void {
    this.activeView = view;
  }

}