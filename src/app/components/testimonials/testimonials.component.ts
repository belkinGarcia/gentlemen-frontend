import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  testimonials = [
    { quote: 'Excelente atención, no hay aglomeración, muy detallistas, amables. Lo recomiendo.', author: 'DIEGO SAN MARTÍN', rating: 5 },
    { quote: 'Excelente atención y medidas sanitarias contra el covid.', author: 'MARCO ANTONIO CHIRINOS ESLAVA', rating: 5 },
    { quote: 'Excelente servicio, barberos muy profesionales.', author: 'LEON LEON', rating: 5 },
    { quote: 'El mejor lugar para un corte de cabello y barba, 100% recomendado.', author: 'CARLOS V.', rating: 5 },
    { quote: 'La atención es de primera y los productos que usan son de alta calidad.', author: 'JAVIER P.', rating: 5 },
    { quote: 'Siempre salgo satisfecho. Un ambiente genial y barberos expertos.', author: 'MIGUEL R.', rating: 5 },
  ];

  currentIndex = 0;
  private intervalId: any;

  ngOnInit(): void {
    this.startCarousel();
  }

  ngOnDestroy(): void {
    this.stopCarousel();
  }

  startCarousel(): void {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 3) % this.testimonials.length;
    }, 3000); // Cambia cada 3 segundos
  }

  stopCarousel(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}