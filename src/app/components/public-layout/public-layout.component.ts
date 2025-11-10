import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { UiStateService, HeroState } from '../../services/ui-state.service';
import { HeaderComponent } from '../header/header.component';
import { HeroComponent } from '../hero/hero.component';
import { FooterComponent } from '../footer/footer.component';
@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    HeroComponent,
    FooterComponent
  ],
  templateUrl: './public-layout.component.html',
  styleUrls: ['../../app.component.css'] 
})
export class PublicLayoutComponent {
  heroState$: Observable<HeroState>;
  constructor(private uiStateService: UiStateService) {
    this.heroState$ = this.uiStateService.heroState$;
  }
}