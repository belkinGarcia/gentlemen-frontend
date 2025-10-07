import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private servicesByCategory = [
    {
      category: 'Servicios Individuales',
      items: [
        { id: 1, name: 'CORTE + LAVADO + PEINADO', description: 'Asesoría, corte, lavado y peinado para un look impecable.', price: 60, imageUrl: 'https://cdn.midjourney.com/06eea00b-3673-4d1e-9a02-21b559549bea/0_0.png' },
        { id: 2, name: 'ARREGLO/AFEITADO DE BARBA', description: 'Delineado, afeitado con toalla caliente e hidratación.', price: 40, imageUrl: 'https://cdn.midjourney.com/d6dbadc2-9f7f-48a7-98b3-3c3ec3dca6d4/0_0.png' },
        { id: 3, name: 'RITUAL DE BARBA', description: 'Tratamiento completo con exfoliación, aceites y bálsamo.', price: 50, imageUrl: 'https://cdn.midjourney.com/d6dbadc2-9f7f-48a7-98b3-3c3ec3dca6d4/0_0.png' },
        { id: 4, name: 'LIMPIEZA FACIAL', description: 'Limpieza profunda para revitalizar la piel.', price: 70, imageUrl: 'https://cdn.midjourney.com/d6dbadc2-9f7f-48a7-98b3-3c3ec3dca6d4/0_0.png' }
      ]
    },
    {
      category: 'Paquetes',
      items: [
        { id: 5, name: 'CORTE + ARREGLO/AFEITADO DE BARBA', description: 'El combo perfecto para un look completo.', price: 90, imageUrl: 'https://cdn.midjourney.com/abfa96d5-5cc2-473d-9bf0-3d0872a0f222/0_0.png' },
        { id: 6, name: 'CORTE + RITUAL DE BARBA', description: 'Corte premium más el tratamiento completo para tu barba.', price: 100, imageUrl: 'https://cdn.midjourney.com/af664313-ecb3-4d25-8b68-e609b8491391/0_1.png' },
        { id: 7, name: 'CORTE + LIMPIEZA FACIAL', description: 'Renueva tu look y tu piel en una sola visita.', price: 120, imageUrl: 'https://cdn.midjourney.com/af664313-ecb3-4d25-8b68-e609b8491391/0_1.png' },
        { id: 8, name: 'ARREGLO/AFEITADO DE BARBA + LIMPIEZA FACIAL', description: 'Cuidado facial y de barba para una apariencia pulcra.', price: 100, imageUrl: 'https://cdn.midjourney.com/abfa96d5-5cc2-473d-9bf0-3d0872a0f222/0_0.png' }
      ]
    },
    {
      category: 'Tinturación',
      items: [
        { id: 9, name: 'CAMUFLAJE DE CANAS PARA PELO', description: 'Cobertura de canas con un acabado natural y discreto.', price: 60, imageUrl: 'https://cdn.midjourney.com/b5bb7e8b-948e-46d6-a305-944e3852db76/0_0.png' },
        { id: 10, name: 'CAMUFLAJE DE CANAS PARA BARBA', description: 'Iguala el tono de tu barba de forma natural.', price: 50, imageUrl: 'https://cdn.midjourney.com/946cfa20-0938-4475-9fad-6850e62e3cf8/0_0.png' },
        { id: 11, name: 'CORTE + CAMUFLAJE DE CANAS DE PELO', description: 'Corte completo más cobertura de canas.', price: 110, imageUrl: 'https://cdn.midjourney.com/946cfa20-0938-4475-9fad-6850e62e3cf8/0_0.png' }
      ]
    }
  ];

  constructor() { }

  // Get all services grouped by category
  getServicesByCategory() {
    return this.servicesByCategory;
  }

  // Find a specific service by its ID across all categories
  getServiceById(id: number) {
    for (const category of this.servicesByCategory) {
      const foundService = category.items.find(service => service.id === id);
      if (foundService) {
        return foundService;
      }
    }
    return undefined;
  }
}