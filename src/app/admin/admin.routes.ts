// src/app/admin/admin.routes.ts

import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
// --- ¡NUEVA IMPORTACIÓN! ---
import { ReservationManagementComponent } from './pages/reservation-management/reservation-management.component';
import { BarberManagementComponent } from './pages/barber-management/barber-management.component'; // <-- ¡NUEVA IMPORTACIÓN!
import { ScheduleManagementComponent } from './pages/schedule-management/schedule-management.component'; // <-- ¡NUEVA IMPORTACIÓN!

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        component: AdminDashboardComponent, // Este componente debe tener un <router-outlet>
        children: [
            { path: 'barberos', component: BarberManagementComponent },
            // ... otras rutas anidadas en dashboard
        ]
      },
      { path: 'usuarios', component: UserManagementComponent },
      
      // --- ¡NUEVA RUTA AÑADIDA! ---
      // Ruta: /admin/reservas
      { path: 'reservas', component: ReservationManagementComponent },
      { path: 'barberos', component: BarberManagementComponent },
      { path: 'barberos/horarios/:id', component: ScheduleManagementComponent } // Ruta anidada
    ]
  }
];