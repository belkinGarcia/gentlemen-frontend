import { Component } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common'; // Importar AsyncPipe y NgIf
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeroComponent } from './components/hero/hero.component';
import { UiStateService, HeroState } from './services/ui-state.service'; // Importar el servicio y la interfaz
import { Observable } from 'rxjs'; // Importar Observable

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    HeroComponent,
    AsyncPipe, // <-- Añadir
    NgIf       // <-- Añadir
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Creamos un Observable que contendrá el estado del banner
  heroState$: Observable<HeroState>;

  constructor(private uiStateService: UiStateService) {
    // Conectamos nuestro observable local al observable del servicio
    this.heroState$ = this.uiStateService.heroState$;
  }
}