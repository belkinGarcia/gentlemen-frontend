import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Importa RouterModule y Router
import { AuthService } from '../../services/auth.service'; // Ajusta la ruta si es necesario
import { Observable, of } from 'rxjs';

// Importaciones de Angular Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UiStateService } from '../../services/ui-state.service'; // Ajusta la ruta si es necesario

@Component({
  selector: 'app-account-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // Añade RouterModule para router-outlet y routerLink
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule
  ],
  templateUrl: './account-dashboard.component.html',
  styleUrls: ['./account-dashboard.component.css']
})
export class AccountDashboardComponent implements OnInit {
  
  currentUser$: Observable<any | null>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private uiStateService: UiStateService
  ) {
    this.currentUser$ = of(this.authService.getCurrentUser());
  }

  ngOnInit(): void {
    // Configura el Héroe para la página de cuenta
    this.uiStateService.setHeroState({
      type: 'banner',
      title: 'MI CUENTA',
      imageUrl: 'https://cdn.midjourney.com/c0d03bc8-50cc-4dc3-9199-1abd30f85020/0_0.png'
    });
  }

  logout(): void {
    this.authService.logout();
  }
}