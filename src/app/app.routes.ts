import { Routes } from '@angular/router';
// Solo importamos los componentes que son PÁGINAS COMPLETAS
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ShopComponent } from './pages/shop/shop.component';
import { AboutComponent } from './pages/about/about.component';
import { LocationsPageComponent } from './pages/locations-page/locations-page.component';
import { ServicesPageComponent } from './pages/services-page/services-page.component';
import { ServiceDetailComponent } from './pages/service-detail/service-detail.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { TermsPageComponent } from './pages/terms-page/terms-page.component';
import { BarberDetailComponent } from './pages/barber-detail/barber-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tienda', component: ShopComponent },
  { path: 'producto/:id', component: ProductDetailComponent },
  { path: 'nosotros', component: AboutComponent },
  { path: 'ubicaciones', component: LocationsPageComponent },
  // Add placeholder routes
  { path: 'servicios', component: ServicesPageComponent },
  { path: 'servicios/:id', component: ServiceDetailComponent },
  { path: 'mi-cuenta', component: AccountPageComponent },
   { path: 'terminos-y-condiciones', component: TermsPageComponent },
  { path: 'barberos/:id', component: BarberDetailComponent },
  { path: '**', redirectTo: '' }
];