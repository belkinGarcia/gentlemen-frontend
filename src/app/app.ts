import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiStateService, HeroState } from './services/ui-state.service'; // Importar el servicio y la interfaz
import { Observable } from 'rxjs'; // Importar Observable

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
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