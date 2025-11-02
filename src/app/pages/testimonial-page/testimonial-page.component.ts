// src/app/pages/testimonial-page/testimonial-page.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider'; // Para el divisor

import { TestimonialService } from '../../services/testimonial.service';
import { AuthService } from '../../services/auth.service'; // Para precargar el nombre
import { UiStateService } from '../../services/ui-state.service'; // Para el Hero Banner

@Component({
  selector: 'app-testimonial-page',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, 
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatDividerModule, RouterModule
  ],
  templateUrl: './testimonial-page.component.html',
  styleUrls: ['./testimonial-page.component.css']
})
export class TestimonialPageComponent implements OnInit {
  
  testimonialForm: FormGroup;
  currentRating: number = 0;
  isSubmitted: boolean = false;
  maxCommentLength = 500;

  constructor(
    private fb: FormBuilder,
    private testimonialService: TestimonialService,
    private authService: AuthService,
    private uiStateService: UiStateService // Inyectar UiStateService
  ) {
    this.testimonialForm = this.fb.group({
      clientName: ['', Validators.required],
      comment: ['', [Validators.required, Validators.maxLength(this.maxCommentLength)]],
      rating: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    // Configurar el banner
    this.uiStateService.setHeroState({
      type: 'banner',
      title: 'DÉJANOS TU RESEÑA',
      imageUrl: 'https://cdn.midjourney.com/c0d03bc8-50cc-4dc3-9199-1abd30f85020/0_0.png'
    });
    
    // Si el usuario está logueado, precarga su nombre
    const user = this.authService.getCurrentUser();
    if (user && user.firstName) {
      this.testimonialForm.get('clientName')?.setValue(`${user.firstName} ${user.lastName}`);
    }
  }

  setRating(rating: number): void {
    this.currentRating = rating;
    this.testimonialForm.get('rating')?.setValue(rating);
  }

  submitTestimonial(): void {
    if (this.testimonialForm.valid) {
      const { rating, ...data } = this.testimonialForm.value;

      this.testimonialService.createTestimonial({
        clientName: data.clientName,
        comment: data.comment,
        rating: rating,
      } as any);

      this.isSubmitted = true;
      console.log('Testimonio enviado para moderación.');
      
    } else {
      this.testimonialForm.markAllAsTouched();
    }
  }
}