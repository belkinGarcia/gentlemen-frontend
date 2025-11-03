// src/app/app.routes.ts
import { Routes } from '@angular/router';

// --- Guards ---
import { AuthGuard} from './auth-guard'; 
import { AdminGuard } from './admin-guard';

// --- Layouts (Nuestra nueva estructura) ---
import { PublicLayoutComponent } from './components/public-layout/public-layout.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
            
// --- Páginas Públicas ---
import { HomeComponent } from './pages/home/home.component';
import { ShopComponent } from './pages/shop/shop.component';
import { AboutComponent } from './pages/about/about.component';
import { LocationsPageComponent } from './pages/locations-page/locations-page.component';
import { ServicesPageComponent } from './pages/services-page/services-page.component';
import { ServiceDetailComponent } from './pages/service-detail/service-detail.component';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { TermsPageComponent } from './pages/terms-page/terms-page.component';
import { BarberDetailComponent } from './pages/barber-detail/barber-detail.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartPageComponent } from './components/cart-page/cart-page';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';

// --- Páginas de Cuenta de Usuario ---
import { AccountDashboardComponent } from './pages/account-dashboard/account-dashboard.component';
import { ProfileComponent } from './pages/account-dashboard/profile/profile.component';
import { ReservasComponent } from './pages/account-dashboard/reservas/reservas.component';
import { PedidosComponent } from './pages/account-dashboard/pedidos/pedidos.component';
import { SeguridadComponent } from './pages/account-dashboard/seguridad/seguridad.component';
import { PedidoDetailComponent } from './pages/account-dashboard/pedido-detail/pedido-detail.component';
import { TestimonialPageComponent } from './pages/testimonial-page/testimonial-page.component'; // <-- ¡NUEVA IMPORTACIÓN!

// --- Páginas de Admin ---
import { AdminDashboardComponent } from './admin/pages/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './admin/pages/user-management/user-management.component';
import { ReservationManagementComponent } from './admin/pages/reservation-management/reservation-management.component';
import { OrderManagementComponent } from './admin/pages/order-management/order-management.component';
import { ProductManagementComponent } from './admin/pages/product-management/product-management.component';
import { BarberManagementComponent } from './admin/pages/barber-management/barber-management.component';
import { ScheduleManagementComponent } from './admin/pages/schedule-management/schedule-management.component';
import { ServiceManagementComponent } from './admin/pages/service-management/service-management.component';
import { LocationManagementComponent } from './admin/pages/location-management/location-management.component';
import { TestimonialManagementComponent } from './admin/pages/testimonial-management/testimonial-management.component';
import { ContentManagementComponent } from './admin/pages/content-management/content-management.component';

export const routes: Routes = [
  
  // --- RUTA DE ADMIN (Layout Separado) ---
  // Carga el AdminLayoutComponent y sus rutas hijas
{
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      
      { path: 'dejar-testimonio', component: TestimonialPageComponent },
      { path: 'usuarios', component: UserManagementComponent }, 
      
      // 2. ¡AÑADIR LAS RUTAS FALTANTES DE BARBEROS!
      { path: 'barberos', component: BarberManagementComponent }, 
      { path: 'barberos/horarios/:id', component: ScheduleManagementComponent }, // Ruta anidada de horarios
      
      { path: 'reservas', component: ReservationManagementComponent },
      { path: 'pedidos', component: OrderManagementComponent },
      { path: 'productos', component: ProductManagementComponent },
      { path: 'servicios', component: ServiceManagementComponent },
      { path: 'sedes', component: LocationManagementComponent },
      { path: 'testimonios', component: TestimonialManagementComponent },   
      { path: 'contenido', component: ContentManagementComponent }  
    ]
  },

  // --- RUTAS PÚBLICAS (Layout Separado) ---
  // Carga el PublicLayoutComponent y todas las demás rutas como hijas
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'tienda', component: ShopComponent },
      { path: 'nosotros', component: AboutComponent },
      { path: 'ubicaciones', component: LocationsPageComponent },
      { path: 'servicios', component: ServicesPageComponent },
      { path: 'servicios/:id', component: ServiceDetailComponent },
      { path: 'terminos-y-condiciones', component: TermsPageComponent },
      { path: 'barberos/:id', component: BarberDetailComponent },
      { path: 'auth/login', component: AuthPageComponent },
      { path: 'checkout', component: CheckoutPageComponent },
      { path: 'producto/:id', component: ProductDetailComponent },
      { path: 'carrito', component: CartPageComponent },
      { path: 'dejar-testimonio', component: TestimonialPageComponent }, // <-- Debe estar aquí
      // --- Ruta de Cuenta Anidada (va dentro del Layout Público) ---
      {
        path: 'mi-cuenta',
        component: AccountDashboardComponent,
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'perfil', pathMatch: 'full' },
          { path: 'perfil', component: ProfileComponent },
          { path: 'reservas', component: ReservasComponent },
          { path: 'pedidos', component: PedidosComponent },
          { path: 'pedidos/:id', component: PedidoDetailComponent },
          { path: 'seguridad', component: SeguridadComponent }
        ]
      }
    ]
  },

  // Redirección final
  { path: '**', redirectTo: '' }
];