import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { ReservationManagementComponent } from './pages/reservation-management/reservation-management.component';
import { BarberManagementComponent } from './pages/barber-management/barber-management.component';
import { ScheduleManagementComponent } from './pages/schedule-management/schedule-management.component';
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        component: AdminDashboardComponent,
        children: [
            { path: 'barberos', component: BarberManagementComponent },
        ]
      },
      { path: 'usuarios', component: UserManagementComponent },
      { path: 'reservas', component: ReservationManagementComponent },
      { path: 'barberos', component: BarberManagementComponent },
      { path: 'barberos/horarios/:id', component: ScheduleManagementComponent }
    ]
  }
];