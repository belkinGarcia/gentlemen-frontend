import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

// Mantenemos la interfaz en inglés tal cual la tenías (o implícita)
export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category: string;
  brand: string;
}

export interface PaginatedProducts {
  products: any[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = 'http://localhost:8080/api/v1/products';

  private productsSubject = new BehaviorSubject<any[]>([]);
  public products$: Observable<any[]> = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {
    // Al iniciar, cargamos los datos reales del backend
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.http.get<any[]>(this.API_URL).subscribe({
      next: (data) => {
        console.log('Productos cargados (formato inglés):', data);
        // Gracias a @JsonProperty en Java, 'data' ya viene con keys: id, name, price, etc.
        this.productsSubject.next(data);
      },
      error: (error) => console.error('Error cargando productos:', error)
    });
  }

  /**
   * Mantiene tu lógica original de paginación en frontend.
   * Tus componentes usan esto, así que no lo cambiamos.
   */
  getProducts(page: number = 1, limit: number = 10): PaginatedProducts {
    const allProducts = this.productsSubject.getValue();
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedProducts = allProducts.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      total: allProducts.length
    };
  }

  getAllProducts(): any[] {
    return this.productsSubject.getValue();
  }

  getAllProductsList(): any[] {
    return this.productsSubject.getValue();
  }

  getProductById(id: number): any {
    return this.getAllProductsList().find(p => p.id === id);
  }

  createProduct(product: any): void {
    // Enviamos al backend. El backend espera un JSON.
    // Como usamos @JsonProperty, el backend entenderá "name", "price", etc.
    this.http.post(this.API_URL, product).subscribe({
      next: (newProduct: any) => {
        const currentProducts = this.getAllProductsList();
        // Agregamos el nuevo producto a la lista local para ver el cambio inmediato
        this.productsSubject.next([...currentProducts, newProduct]);
      },
      error: (e) => console.error('Error creando producto', e)
    });
  }

  updateProduct(updatedProduct: any): void {
    // Asumiendo que agregues PUT en el backend
    // Por ahora actualizamos localmente para no romper la UI
    const currentProducts = this.getAllProductsList();
    const updatedProducts = currentProducts.map(p =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    this.productsSubject.next(updatedProducts);
  }

  deleteProduct(id: number): void {
    this.http.delete(`${this.API_URL}/${id}`).subscribe({
      next: () => {
        const currentProducts = this.getAllProductsList();
        const updatedProducts = currentProducts.filter(p => p.id !== id);
        this.productsSubject.next(updatedProducts);
      },
      error: (e) => console.error('Error eliminando producto', e)
    });
  }
}
