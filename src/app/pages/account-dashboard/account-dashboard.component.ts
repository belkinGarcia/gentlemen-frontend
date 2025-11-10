import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UiStateService } from '../../services/ui-state.service';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-account-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule
  ],
  templateUrl: './account-dashboard.component.html',
  styleUrls: ['./account-dashboard.component.css']
})
export class AccountDashboardComponent implements OnInit {
  currentUser$: Observable<any | null>;
  isAdmin$: Observable<boolean>;
  constructor(
    private authService: AuthService,
    private router: Router,
    private uiStateService: UiStateService
  ) {
    this.currentUser$ = of(this.authService.getCurrentUser());
    this.isAdmin$ = this.currentUser$.pipe(
      map(() => this.authService.isAdmin())
    );
  }
  ngOnInit(): void {
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