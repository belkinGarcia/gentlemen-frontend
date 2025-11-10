import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
export interface Testimonial {
  id: number;
  clientName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  date: Date;
  status: 'pending' | 'approved' | 'rejected';
}
@Injectable({
  providedIn: 'root'
})
export class TestimonialService {
  private readonly TESTIMONIAL_KEY = 'testimonial_database';
  private testimonialsSubject = new BehaviorSubject<Testimonial[]>(this.loadFromStorage());
  public testimonials$: Observable<Testimonial[]> = this.testimonialsSubject.asObservable();
  public approvedTestimonials$: Observable<Testimonial[]>;
 constructor() {
    this.approvedTestimonials$ = this.testimonials$.pipe(
      map(testimonials => testimonials.filter(t => t.status === 'approved'))
    );
  }
  private loadFromStorage(): Testimonial[] {
    const data = localStorage.getItem(this.TESTIMONIAL_KEY);
    const initialData: Testimonial[] = data ? JSON.parse(data) : [
        { id: 1, clientName: 'Juan P.', rating: 5, comment: 'Excelente servicio y puntualidad. ¡Volveré!', date: new Date(), status: 'approved' },
        { id: 2, clientName: 'María G.', rating: 4, comment: 'El corte quedó muy bien, aunque tardaron un poco.', date: new Date(), status: 'pending' },
    ];
    return initialData.map(t => ({ ...t, date: new Date(t.date) }));
  }
  private _saveToStorage(testimonials: Testimonial[]): void {
    localStorage.setItem(this.TESTIMONIAL_KEY, JSON.stringify(testimonials));
    this.testimonialsSubject.next(testimonials);
  }
  /**
   * Crea un nuevo testimonio (siempre en estado 'pending').
   */
  createTestimonial(testimonialData: Omit<Testimonial, 'id' | 'status' | 'date'>): void {
    const currentTestimonials = this.testimonialsSubject.getValue();
    const newId = Math.max(...currentTestimonials.map(t => t.id), 0) + 1;
    const newTestimonial: Testimonial = { 
        ...testimonialData as Testimonial, 
        id: newId, 
        date: new Date(), 
        status: 'pending' 
    };
    this._saveToStorage([...currentTestimonials, newTestimonial]);
  }
  /**
   * Obtiene todos los testimonios (para la tabla de admin).
   */
  getAllTestimonials(): Observable<Testimonial[]> {
    return this.testimonials$;
  }
  /**
   * Actualiza el estado de un testimonio (Aprobar/Rechazar).
   */
  updateTestimonialStatus(id: number, status: 'pending' | 'approved' | 'rejected'): void {
    const currentTestimonials = this.testimonialsSubject.getValue();
    const updatedList = currentTestimonials.map(t => 
        t.id === id ? { ...t, status: status } : t
    );
    this._saveToStorage(updatedList);
  }
  /**
   * Elimina un testimonio.
   */
  deleteTestimonial(id: number): void {
    const currentTestimonials = this.testimonialsSubject.getValue();
    const updatedList = currentTestimonials.filter(t => t.id !== id);
    this._saveToStorage(updatedList);
  }
}