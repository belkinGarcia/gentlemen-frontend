// src/app/components/hero/hero.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router'; // 1. Importar Router
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // 2. Importar MatDialog
import { BookingComponent } from '../booking/booking.component'; // 3. Importar el componente del diálogo

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {
  slides = [
    // ... tu array de slides (sin cambios) ...
    {
    imageUrl: 'https://cdn.midjourney.com/c0d03bc8-50cc-4dc3-9199-1abd30f85020/0_0.png',
    subtitle: 'LOS MEJORES AMBIENTES DE',
    title: 'BARBERÍA CLÁSICA EN 7 SEDES',
    buttonText: 'RESERVAR UNA CITA'
  },
  {
    imageUrl: 'https://cdn.midjourney.com/c0d03bc8-50cc-4dc3-9199-1abd30f85020/0_0.png',
    subtitle: 'BRINDAMOS UN SERVICIO',
    title: 'DE PRIMER NIVEL',
    buttonText: 'RESERVAR UNA CITA'
  },
  {
    imageUrl: 'https://cdn.midjourney.com/c0d03bc8-50cc-4dc3-9199-1abd30f85020/0_0.png',
    subtitle: 'PRODUCTOS DE CALIDAD',
    title: 'INTERNACIONAL',
    buttonText: 'VER PRODUCTOS'
  },
  {
    imageUrl: 'https://cdn.midjourney.com/c0d03bc8-50cc-4dc3-9199-1abd30f85020/0_0.png',
    subtitle: 'BEBIDAS DE CORTESÍA PARA UNA',
    title: 'EXPERIENCIA TOP',
    buttonText: 'RESERVAR UNA CITA'
  }
  ];

  currentIndex = 0;

  // 6. Inyectar MatDialog y Router en el constructor
  constructor(
    public dialog: MatDialog,
    private router: Router
  ) {}

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  // 7. Añadir esta función para manejar el clic del botón
  onHeroButtonClick(slide: any): void {
    if (slide.buttonText === 'RESERVAR UNA CITA') {
      this.openBookingDialog();
    } else if (slide.buttonText === 'VER PRODUCTOS') {
      this.router.navigate(['/tienda']); // Te lleva a la tienda
    }
  }

  // 8. Añadir la función para abrir el diálogo
  openBookingDialog(): void {
    this.dialog.open(BookingComponent, {
      width: '90%',
      maxWidth: '1200px',
      // panelClass: 'custom-dialog-container' // (Opcional, si tienes estilos globales)
    });
  }
}