// src/app/components/hero/hero.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {
  slides = [
    {
    imageUrl: 'https://cdn.midjourney.com/c0d03bc8-50cc-4dc3-9199-1abd30f85020/0_0.png',
    subtitle: 'LOS MEJORES AMBIENTES DE',
    title: 'BARBERÍA CLÁSICA EN 7 SEDES',
    buttonText: 'RESERVAR UNA CITA'
  },
  {
    imageUrl: 'https://cdn.midjourney.com/3d4806ee-d8e1-44da-9f54-b8c1548efdc8/0_2.png',
    subtitle: 'BRINDAMOS UN SERVICIO',
    title: 'DE PRIMER NIVEL',
    buttonText: 'RESERVAR UNA CITA'
  },
  {
    imageUrl: 'https://cdn.midjourney.com/d6dbadc2-9f7f-48a7-98b3-3c3ec3dca6d4/0_0.png',
    subtitle: 'PRODUCTOS DE CALIDAD',
    title: 'INTERNACIONAL',
    buttonText: 'VER PRODUCTOS'
  },
  {
    imageUrl: 'https://cdn.midjourney.com/21db8abb-babb-44af-8350-4515018a77ba/0_0.png',
    subtitle: 'BEBIDAS DE CORTESÍA PARA UNA',
    title: 'EXPERIENCIA TOP',
    buttonText: 'RESERVAR UNA CITA'
  }
  ];

  currentIndex = 0;

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }
}