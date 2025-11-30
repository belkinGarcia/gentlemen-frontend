import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';

export interface Testimonial {
  id?: number;
  clientName: string;
  rating: number;
  comment: string;
  date?: Date;
  status?: 'pending' | 'approved' | 'rejected';
}

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {
  private API_URL = 'http://localhost:8080/api/v1/testimonios';

  // Subject solo para la web pública (aprobados)
  private testimonialsSubject = new BehaviorSubject<Testimonial[]>([]);
  public testimonials$ = this.testimonialsSubject.asObservable();
  public approvedTestimonials$ = this.testimonials$; 

  constructor(private http: HttpClient) {
    this.loadApprovedTestimonials();
  }

  // --- WEB PÚBLICA ---

  loadApprovedTestimonials(): void {
    this.http.get<any[]>(`${this.API_URL}/aprobados`).pipe(
      map(javaList => javaList.map(t => this.mapJavaToAngular(t)))
    ).subscribe({
      next: (data) => this.testimonialsSubject.next(data),
      error: (err) => console.error('Error cargando testimonios', err)
    });
  }

  createTestimonial(data: Testimonial): void {
    const payload = {
        nombreCliente: data.clientName,
        comentario: data.comment,
        calificacion: data.rating,
        estado: 'PENDIENTE'
    };
    this.http.post(this.API_URL, payload).subscribe();
  }

  // --- PANEL DE ADMIN (Métodos restaurados) ---

  /**
   * Obtiene TODOS los testimonios para el admin.
   * Retorna un Observable directo (sin caché local) para tener datos frescos.
   */
  getAllTestimonials(): Observable<Testimonial[]> {
    return this.http.get<any[]>(this.API_URL).pipe(
      map(javaList => javaList.map(t => this.mapJavaToAngular(t)))
    );
  }

updateTestimonialStatus(id: number, status: 'pending' | 'approved' | 'rejected'): Observable<any> {
    let javaStatus = '';

    // Traducción manual para coincidir con el Enum de Java
    switch (status) {
      case 'approved':
        javaStatus = 'APROBADO';
        break;
      case 'rejected':
        javaStatus = 'RECHAZADO';
        break;
      default:
        javaStatus = 'PENDIENTE';
        break;
    }

    // Ahora enviamos ?estado=APROBADO en lugar de APPROVED
    return this.http.put(`${this.API_URL}/${id}/estado?estado=${javaStatus}`, {});
  }

  deleteTestimonial(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  // --- HELPER ---
  private mapJavaToAngular(t: any): Testimonial {
    // Mapeo seguro del estado
    let statusAngular: 'pending' | 'approved' | 'rejected' = 'pending';
    if (t.estado === 'APROBADO') statusAngular = 'approved';
    if (t.estado === 'RECHAZADO') statusAngular = 'rejected';

    return {
      id: t.idTestimonio,
      clientName: t.nombreCliente,
      comment: t.comentario,
      rating: t.calificacion,
      date: new Date(t.fecha),
      status: statusAngular
    };
  }
}