import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Marca {
  idMarca?: number;
  nombre: string;
  descripcion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private apiUrl = 'http://localhost:8080/api/v1/marcas';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Marca[]> {
    return this.http.get<Marca[]>(this.apiUrl);
  }

  create(marca: Marca): Observable<Marca> {
    return this.http.post<Marca>(this.apiUrl, marca);
  }
  
  update(id: number, marca: Marca): Observable<Marca> {
     return this.http.post<Marca>(this.apiUrl, { ...marca, idMarca: id });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}