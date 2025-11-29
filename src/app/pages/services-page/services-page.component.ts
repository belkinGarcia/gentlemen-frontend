import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// 💡 Importar el Observable
import { Observable } from 'rxjs';
// 💡 Importar las interfaces (Category) para un mejor tipado
import { ServiceService, Category } from '../../services/service.service';
import { UiStateService } from '../../services/ui-state.service';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './services-page.component.html',
  styleUrls: ['./services-page.component.css']
})
export class ServicesPageComponent implements OnInit {
  // 💡 CAMBIO CLAVE: Ahora es un Observable, no un array estático.
  // El símbolo $ es una convención para Observables.
  servicesByCategory$: Observable<Category[]>;

  view: 'categories' | 'services' = 'categories';
  selectedCategory: Category | null = null; // Tipado mejorado

  constructor(
    private serviceService: ServiceService,
    private uiStateService: UiStateService
  ) {
    // 💡 ASIGNAR el Observable del servicio en el constructor.
    this.servicesByCategory$ = this.serviceService.categories$;
  }

  ngOnInit(): void {
    // 💡 ELIMINAR la llamada síncrona que fallaba:
    // this.servicesByCategory = this.serviceService.getServicesByCategory();

    this.uiStateService.setHeroState({
      type: 'banner',
      title: 'SERVICIOS',
      imageUrl: 'https://cdn.midjourney.com/c0d03bc8-50cc-4dc3-9199-1abd30f85020/0_0.png'
    });
  }

  // Asegurar el tipado de la categoría
  selectCategory(category: Category): void {
    this.selectedCategory = category;
    this.view = 'services';
  }

  backToCategories(): void {
    this.view = 'categories';
    this.selectedCategory = null;
  }
}
