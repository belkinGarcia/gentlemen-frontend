import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
// 👇 CORRECCIÓN: El componente se llama AppComponent y está en './app/app.component'
import { AppComponent } from './app/app';

// 👇 CORRECCIÓN: Usamos el nombre correcto del componente aquí también
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));