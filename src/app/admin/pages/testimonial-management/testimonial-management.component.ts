import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TestimonialService, Testimonial } from '../../../services/testimonial.service'; 
import { Router } from '@angular/router';
@Component({
  selector: 'app-testimonial-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './testimonial-management.component.html',
  styleUrls: ['./testimonial-management.component.css']
})
export class TestimonialManagementComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['clientName', 'rating', 'comment', 'date', 'status', 'actions'];
  dataSource: Testimonial[] = [];
  private testimonialSub: Subscription | undefined;
  constructor(
    private testimonialService: TestimonialService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.testimonialSub = this.testimonialService.getAllTestimonials().subscribe(testimonials => {
      this.dataSource = testimonials.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return b.date.getTime() - a.date.getTime();
      });
    });
  }
  ngOnDestroy(): void {
    this.testimonialSub?.unsubscribe();
  }
  approve(testimonial: Testimonial): void {
    this.testimonialService.updateTestimonialStatus(testimonial.id, 'approved');
  }
  reject(testimonial: Testimonial): void {
    this.testimonialService.updateTestimonialStatus(testimonial.id, 'rejected');
  }
  delete(id: number): void {
    if (confirm('¿Estás seguro de eliminar permanentemente este testimonio?')) {
      this.testimonialService.deleteTestimonial(id);
    }
  }
  getStatusColor(status: 'pending' | 'approved' | 'rejected'): 'primary' | 'warn' | 'accent' {
    switch (status) {
      case 'approved': return 'primary'; 
      case 'rejected': return 'warn';   
      default: return 'accent';         
    }
  }
}