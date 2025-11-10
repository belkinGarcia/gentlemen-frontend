import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
const MOCK_PRODUCTS = [
  { id: 1, name: 'Cera Moldeadora Premium', price: 80.00, imageUrl: 'https://i.ibb.co/b3sWfK4/cera.png', description: 'Cera de fijación fuerte para un look natural.', category: 'Cuidado Capilar', brand: 'Gentlemen' },
  { id: 2, name: 'Aceite para Barba "El Leñador"', price: 125.50, imageUrl: 'https://i.ibb.co/D7NmqjR/aceite.png', description: 'Nutre y suaviza la barba con aroma a cedro.', category: 'Cuidado de Barba', brand: 'Barba Larga' },
  { id: 3, name: 'Shampoo Fortalecedor', price: 89.00, imageUrl: 'https://i.ibb.co/wJ5pLd5/shampoo.png', description: 'Limpia y fortalece el cabello desde la raíz.', category: 'Cuidado Capilar', brand: 'Gentlemen' },
  { id: 4, name: 'Kit de Afeitado Clásico', price: 140.00, imageUrl: 'https://i.ibb.co/3sC6wzB/kit.png', description: 'Incluye brocha, navaja clásica y jabón de afeitar.', category: 'Afeitado', brand: 'BarberPro' }
];
export interface PaginatedProducts {
  products: any[];
  total: number;
}
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly PRODUCT_KEY = 'product_database';
  private productsSubject = new BehaviorSubject<any[]>([]);
  public products$: Observable<any[]> = this.productsSubject.asObservable();
  constructor() {
    const productsFromStorage = localStorage.getItem(this.PRODUCT_KEY);
    if (productsFromStorage) {
      this.productsSubject.next(JSON.parse(productsFromStorage));
    } else {
      localStorage.setItem(this.PRODUCT_KEY, JSON.stringify(MOCK_PRODUCTS));
      this.productsSubject.next(MOCK_PRODUCTS);
    }
  }
  private _saveToStorage(products: any[]): void {
    localStorage.setItem(this.PRODUCT_KEY, JSON.stringify(products));
    this.productsSubject.next(products);
  }
  /**
   * Obtiene productos con paginación y devuelve el objeto { products, total }
   * que esperaban tus componentes.
   * @param page Número de página (ej. 1, 2, 3...)
   * @param limit Cantidad de elementos por página
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
    const currentProducts = this.getAllProductsList();
    const maxId = currentProducts.length > 0 ? Math.max(...currentProducts.map(p => p.id)) : 0;
    const newId = maxId + 1;
    const newProduct = { ...product, id: newId };
    this._saveToStorage([...currentProducts, newProduct]);
  }
  updateProduct(updatedProduct: any): void {
    const currentProducts = this.getAllProductsList();
    const updatedProducts = currentProducts.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    );
    this._saveToStorage(updatedProducts);
  }
  deleteProduct(id: number): void {
    const currentProducts = this.getAllProductsList();
    const updatedProducts = currentProducts.filter(p => p.id !== id);
    this._saveToStorage(updatedProducts);
  }
}