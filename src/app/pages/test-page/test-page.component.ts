import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 3rem; font-family: sans-serif; background: #f0f0f0; min-height: 100vh;">
      <div style="max-width: 800px; margin: auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <h1 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 1rem;">
          ✅ ¡Prueba de Registro Exitosa!
        </h1>
        <p style="font-size: 1.1rem; color: #34495e;">
          Si estás viendo esto, significa que el formulario de registro se comunicó correctamente con el servicio.
          Estos son los datos que se enviarían a tu backend:
        </p>
        <!-- La pipe 'json' formatea el objeto para que se vea bien -->
        <pre style="background: #ecf0f1; padding: 1.5rem; border-radius: 5px; white-space: pre-wrap; word-wrap: break-word; color: #2c3e50;">{{ registrationData | json }}</pre>
        <button (click)="goBack()" style="margin-top: 1.5rem; padding: 0.8rem 1.5rem; background-color: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem;">
          Volver a la página de cuenta
        </button>
      </div>
    </div>
  `,
})
export class TestPageComponent implements OnInit {
  registrationData: any;
  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.registrationData = navigation?.extras?.state?.['userData'];
  }
  ngOnInit(): void {
    if (!this.registrationData) {
      console.warn('No se recibieron datos de registro.');
      this.registrationData = { error: "No se recibieron datos de registro. Vuelve y completa el formulario." };
    }
  }
  goBack(): void {
    this.router.navigate(['/mi-cuenta']);
  }
}
