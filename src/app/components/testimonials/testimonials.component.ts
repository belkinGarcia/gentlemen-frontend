import { RouterModule } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { TestimonialService, Testimonial } from '../../services/testimonial.service';
@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  testimonials: Testimonial[] = []; 
  currentIndex = 0;
  private intervalId: any;
  private testimonialSub: Subscription | undefined;
  constructor(
    private testimonialService: TestimonialService
  ) {}
  get totalPages(): number {
    return Math.ceil(this.testimonials.length / 3);
  }
  get currentPage(): number {
    return this.currentIndex / 3;
  }
  get pagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i);
  }
  ngOnInit(): void {
    this.testimonialSub = this.testimonialService.approvedTestimonials$.subscribe(approvedList => {
      this.testimonials = approvedList;
      this.currentIndex = 0;
      if (this.testimonials.length > 3) {
        this.startCarousel();
      } else {
        this.stopCarousel();
      }
    });
  }
  ngOnDestroy(): void {
    this.stopCarousel();
    this.testimonialSub?.unsubscribe();
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
  next(): void {
    if (this.currentIndex + 3 < this.testimonials.length) {
      this.currentIndex += 3;
    } else {
       this.currentIndex = 0;
    }
    this.startCarousel();
  }
  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex -= 3;
    } else {
      this.currentIndex = (this.totalPages - 1) * 3;
    }
    this.startCarousel();
  }
}
