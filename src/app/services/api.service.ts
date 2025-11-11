import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Servicio {
  id_servicio?: number;
  nombre: string;
  detalle: string;
  tarifa: number;
  id_tipo_servicio: number;
}
export interface CitaPayload {
  estado: string;
  id_cliente: number;
  id_servicio?: number;
  horario: {
    fecha: string | undefined;
    hora: string | null;
    id_barbero?: number;
  };
}
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:4200/api/v1';
  constructor(private http: HttpClient) {}
  login(credenciales: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credenciales);
  }
  getSedes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/sedes`);
  }
  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.baseUrl}/servicios`);
  }
  getBarberos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/barberos`);
  }
  getBarberosPorSede(idSede: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/barberos`, {
      params: { id_sede: idSede.toString() },
    });
  }
  getHorariosDisponibles(fecha: Date, idBarbero: number): Observable<string[]> {
    const fechaString = fecha.toISOString().split('T')[0];
    let params = new HttpParams().set('fecha', fechaString).set('id_barbero', idBarbero.toString());
    return this.http.get<string[]>(`${this.baseUrl}/horariosAtencion/disponibles`, { params });
  }
  getCitasByCliente(idCliente: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/citas/cliente/${idCliente}`);
  }
  getProductos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/productos`);
  }
  createCita(citaData: CitaPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/citas`, citaData);
  }
}
