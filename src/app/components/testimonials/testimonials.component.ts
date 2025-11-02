// src/app/components/testimonials/testimonials.component.ts
import { RouterModule } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs'; // <-- Importar Subscription
import { TestimonialService, Testimonial } from '../../services/testimonial.service'; // <-- Importar el servicio y la interfaz

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  
  // Lista que contendrá solo los testimonios APROBADOS
  testimonials: Testimonial[] = []; 

  currentIndex = 0;
  private intervalId: any;
  private testimonialSub: Subscription | undefined; // <-- Manejar la suscripción

  constructor(
    private testimonialService: TestimonialService // <-- Inyectar el servicio
  ) {}

  // Calculamos el número de páginas (basado en 3 items por vista)
  get totalPages(): number {
    return Math.ceil(this.testimonials.length / 3);
  }

  // Obtenemos la página actual (0, 1, etc.)
  get currentPage(): number {
    return this.currentIndex / 3;
  }

  // Generamos un array para usarlo en el *ngFor de las líneas
  get pagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i);
  }

  ngOnInit(): void {
    // --- CONEXIÓN DE DATOS ---
    // Nos suscribimos al observable de testimonios APROBADOS
    this.testimonialSub = this.testimonialService.approvedTestimonials$.subscribe(approvedList => {
      this.testimonials = approvedList;
      this.currentIndex = 0; // Resetear el índice al cambiar la data
      if (this.testimonials.length > 3) {
        this.startCarousel();
      } else {
        this.stopCarousel();
      }
    });
  }

  ngOnDestroy(): void {
    this.stopCarousel();
    this.testimonialSub?.unsubscribe(); // <-- Limpiar la suscripción
  }

  startCarousel(): void {
    if (this.intervalId) { clearInterval(this.intervalId); }
    
    this.intervalId = setInterval(() => {
      this.next();
    }, 5000);
  }

  stopCarousel(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // --- LÓGICA DE NAVEGACIÓN ---
  next(): void {
    // Solo avanzamos si no estamos en la última página
    if (this.currentIndex + 3 < this.testimonials.length) {
      this.currentIndex += 3;
    } else {
       this.currentIndex = 0; // Vuelve al inicio
    }
    this.startCarousel();
  }

  prev(): void {
    // Si el índice actual es mayor a 0, retrocede 3
    if (this.currentIndex > 0) {
      this.currentIndex -= 3;
    } else {
      // Si estamos en la primera página, vamos al final (última página)
      this.currentIndex = (this.totalPages - 1) * 3;
    }
    this.startCarousel();
  }
}
