import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BarberService {
  // Separamos al "Cualquier agente" para un manejo especial
  private anyAgent = { 
    id: 1, 
    name: 'Cualquier agente', 
    bio: 'Deja que uno de nuestros talentosos barberos se encargue de tu estilo, garantizando siempre un servicio de primera calidad.', 
    imageUrl: 'https://cdn.midjourney.com/c56b911a-6ccc-423a-a169-43af58dd0eee/0_1.png', 
    availableAtLocationIds: [1, 2, 3] 
  };
  
  // La propiedad correcta se llama 'barbers'
  private barbers = [
    { id: 2, name: 'JAIR', bio: 'Especialista en cortes clásicos y rituales de barba. Con más de 5 años de experiencia, JAIR combina técnica tradicional y arte moderno.', imageUrl: 'https://cdn.midjourney.com/c56b911a-6ccc-423a-a169-43af58dd0eee/0_1.png', availableAtLocationIds: [1] },
    { id: 3, name: 'DANNY', bio: 'Experto en diseños fade y texturizados. DANNY se mantiene al día con las últimas tendencias para ofrecerte un look fresco y actual.', imageUrl: 'https://cdn.midjourney.com/c56b911a-6ccc-423a-a169-43af58dd0eee/0_1.png', availableAtLocationIds: [2] },
    { id: 4, name: 'VYRO', bio: 'Con más de 5 años de experiencia, VYRO es un maestro de la navaja y el afeitado clásico.', imageUrl: 'https://cdn.midjourney.com/c56b911a-6ccc-423a-a169-43af58dd0eee/0_1.png', availableAtLocationIds: [1, 3] },
    { id: 5, name: 'MIGUEL', bio: 'Apasionado por las últimas tendencias en estilismo masculino y cuidado capilar.', imageUrl: 'https://cdn.midjourney.com/c56b911a-6ccc-423a-a169-43af58dd0eee/0_1.png', availableAtLocationIds: [2, 3] },
    { id: 6, name: 'CHRISTIAN', bio: 'Un barbero detallista y perfeccionista, ideal para quienes buscan un acabado impecable.', imageUrl: 'https://cdn.midjourney.com/c56b911a-6ccc-423a-a169-43af58dd0eee/0_1.png', availableAtLocationIds: [1, 2, 3] }
  ];

  constructor() { }

  // Método para obtener barberos por local, con la opción de incluir "Cualquier agente"
  getBarbersByLocationId(locationId: number, includeAnyAgent: boolean = false): any[] {
    // Corregido para usar 'this.barbers'
    const availableBarbers = this.barbers.filter(barber => barber.availableAtLocationIds.includes(locationId));
    
    if (includeAnyAgent) {
      return [this.anyAgent, ...availableBarbers];
    } else {
      return availableBarbers;
    }
  }
  
  // Método para obtener todos los barberos, incluyendo "Cualquier agente"
  getBarbers() {
    return [this.anyAgent, ...this.barbers];
  }

  // Método para obtener un solo barbero por su ID de la lista completa
  getBarberById(id: number) {
    const allBarbers = [this.anyAgent, ...this.barbers];
    return allBarbers.find(barber => barber.id === id);
  }
}