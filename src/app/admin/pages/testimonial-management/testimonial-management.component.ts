import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { TestimonialService, Testimonial } from '../../../services/testimonial.service';

@Component({
  selector: 'app-testimonial-management',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatButtonModule, 
    MatIconModule, MatChipsModule, MatMenuModule
  ],
  templateUrl: './testimonial-management.component.html',
  styleUrls: ['./testimonial-management.component.css']
})
export class TestimonialManagementComponent implements OnInit {
  displayedColumns: string[] = ['clientName', 'rating', 'comment', 'date', 'status', 'actions'];
  dataSource: Testimonial[] = [];

  constructor(private testimonialService: TestimonialService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Solución error TS7006: Tipamos explícitamente (data: Testimonial[])
    this.testimonialService.getAllTestimonials().subscribe((data: Testimonial[]) => {
      // Solución error TS7006: Tipamos (a, b) en el sort
      this.dataSource = data.sort((a: Testimonial, b: Testimonial) => {
        // Ordenar por fecha descendente (lo más nuevo primero)
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });
    });
  }

  approve(testimonial: Testimonial): void {
    if (testimonial.id) {
      this.testimonialService.updateTestimonialStatus(testimonial.id, 'approved')
        .subscribe(() => this.loadData()); // Recargamos la tabla al terminar
    }
  }

  reject(testimonial: Testimonial): void {
    if (testimonial.id) {
      this.testimonialService.updateTestimonialStatus(testimonial.id, 'rejected')
        .subscribe(() => this.loadData());
    }
  }

  deleteTestimonial(id: number): void {
    if(confirm('¿Estás seguro de eliminar este testimonio?')) {
      this.testimonialService.deleteTestimonial(id)
        .subscribe(() => this.loadData());
    }
  }

  // Helpers para el HTML
  getStatusColor(status: string): string {
    switch(status) {
      case 'approved': return 'primary'; // Verde/Azul
      case 'rejected': return 'warn';    // Rojo
      default: return 'accent';          // Amarillo/Naranja (Pending)
    }
  }

  getStatusLabel(status: string): string {
    switch(status) {
      case 'approved': return 'Aprobado';
      case 'rejected': return 'Rechazado';
      default: return 'Pendiente';
    }
  }
}