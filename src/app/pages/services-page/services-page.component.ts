import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Import Icon Module
import { ServiceService } from '../../services/service.service';
import { UiStateService } from '../../services/ui-state.service';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule], // Add MatIconModule
  templateUrl: './services-page.component.html',
  styleUrls: ['./services-page.component.css']
})
export class ServicesPageComponent implements OnInit {
  servicesByCategory: any[] = [];

  // New properties to manage the view state
  view: 'categories' | 'services' = 'categories';
  selectedCategory: any = null;

  constructor(
    private serviceService: ServiceService,
    private uiStateService: UiStateService
  ) {}

  ngOnInit(): void {
    this.servicesByCategory = this.serviceService.getServicesByCategory();
    this.uiStateService.setHeroState({
      type: 'banner',
      title: 'SERVICIOS',
      imageUrl: 'https://cdn.midjourney.com/c0d03bc8-50cc-4dc3-9199-1abd30f85020/0_0.png'
    });
  }

  // New method to select a category and change the view
  selectCategory(category: any): void {
    this.selectedCategory = category;
    this.view = 'services';
  }

  // New method to return to the category view
  backToCategories(): void {
    this.view = 'categories';
    this.selectedCategory = null;
  }
}