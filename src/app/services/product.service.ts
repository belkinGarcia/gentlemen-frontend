import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products = [
    { id: 1, name: 'SHAMPOO 3-EN-1 ENERGIZING GINGER+TEA 1L', price: 159.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Cuidado de Cabello', brand: 'American Crew', description: 'Shampoo, acondicionador y Body Wash.' },
    { id: 2, name: 'MATTE CLAY SPRAY', price: 95.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Peinado y fijación', brand: 'American Crew', description: 'Fijación media y acabado mate.' },
    { id: 3, name: 'MARMARA BARBER POWDER WAX', price: 70.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Ceras', brand: 'Marmara', description: 'Polvo de cera para el cabello.' },
    { id: 4, name: 'ACEITE PARA BARBA VIKINGO', price: 88.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Cuidado de Barba', brand: 'Vikingo', description: 'Descripción para el aceite de barba.' },
    { id: 5, name: 'FIRM HOLD STYLING GEL', price: 65.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Peinado y fijación', brand: 'American Crew', description: 'Gel de fijación fuerte sin residuos.' },
    { id: 6, name: 'BEARD BALM', price: 90.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Cuidado de Barba', brand: 'The Barber Company', description: 'Bálsamo para hidratar y dar forma a la barba.' },
    { id: 7, name: 'SHAVING CREAM', price: 75.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'MUK', description: 'Crema de afeitar para un rasurado suave.' },
    { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
     { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
      { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
       { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
        { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
         { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
          { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
           { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
            { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
             { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
              { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
               { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                 { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                  { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                   { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                    { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                     { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                      { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                       { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                        { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                         { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                          { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                           { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                            { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                             { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                              { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                               { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                                { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                                 { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                                  { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                                   { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                                    { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                                     { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                                      { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                                       { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                                        { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                                         { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                                          { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                                           { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                                            { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                                             { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                                              { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                                               { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                                                { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                                                 { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                                                  { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                                                   { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                                                    { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
                                                     { id: 8, name: 'AFTER SHAVE LOTION', price: 80.00, imageUrl: 'https://cdn.midjourney.com/aa239742-4938-4995-9984-b36c623b6753/0_0.png', category: 'Afeitado', brand: 'Vikingo', description: 'Loción para después del afeitado.' },
  ];

  constructor() {}

  getProductById(id: number) {
    return this.products.find(p => p.id === id);
  }

  getProducts(page: number = 1, pageSize: number = 8) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return {
      totalProducts: this.products.length,
      products: this.products.slice(startIndex, endIndex)
    };
  }
}