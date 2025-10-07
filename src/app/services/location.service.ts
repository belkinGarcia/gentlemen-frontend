import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private locations = [
    { id: 1, name: 'La Molina', address: 'Javier Prado Este 5295, La Molina, Lima.', imageUrl: 'https://cdn.midjourney.com/c95cfb5e-cb50-48f9-808d-7dd4b36bcc78/0_2.png' },
    { id: 2, name: 'Lince', address: 'Av. jacson 2, Rimac, Lima.', imageUrl: 'https://cdn.midjourney.com/3bc73fde-49ec-49cc-8bf2-c86a3083b5cd/0_3.png' },
    { id: 3, name: 'Lince', address: 'Av. Faisanes 11, Chorrillos, Lima.', imageUrl: 'https://cdn.midjourney.com/e49e9a19-e9fb-4b4a-ab51-24c5d45796ae/0_1.png' },
    { id: 4, name: 'Lince', address: 'Av. Usares 2211, Lince, Lima.', imageUrl: 'https://cdn.midjourney.com/fcd5d465-19d6-4709-aeae-920527da0303/0_0.png' },
    { id: 5, name: 'Lince', address: 'Av. Arenales 2211, Lince, Lima.', imageUrl: 'https://cdn.midjourney.com/36acf826-d3c4-4745-abba-647ce4be6bdc/0_0.png' },
    { id: 6, name: 'Lince', address: 'Av. Arenales 2211, Lince, Lima.', imageUrl: 'https://cdn.midjourney.com/e659d96a-ec14-4abc-b745-24eb1483e0c7/0_0.png' },
    { id: 7, name: 'Lince', address: 'Av. Arenales 2211, Lince, Lima.', imageUrl: 'https://cdn.midjourney.com/2916b0d5-a438-4e9c-a71a-2c154c1492ab/0_2.png' },
    // ... todos tus otros locales
  ];

  constructor() { }

  getLocations() {
    return this.locations;
  }
}