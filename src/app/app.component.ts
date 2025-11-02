import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importa RouterModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule // <-- Solo necesitas RouterModule para el <router-outlet>
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // ¡Toda la lógica del Hero y el UiStateService se movió a 'public-layout.component.ts'!
  // Este componente ahora está limpio.
}