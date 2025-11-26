import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Categoria {
  idCategoria?: number;
  nombre: string;
  descripcion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  // Ajusta el puerto si es necesario (8080)
  private apiUrl = 'http://localhost:8080/api/v1/categorias';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  create(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria);
  }

  // Para editar, el backend debe soportar PUT o usar save() con ID
  update(id: number, categoria: Categoria): Observable<Categoria> {
    // Si tu backend usa el mismo endpoint de guardar para actualizar:
    return this.http.post<Categoria>(this.apiUrl, { ...categoria, idCategoria: id });
    
    // Si creaste un endpoint PUT específico en Java:
    // return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria);
  }
  
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}