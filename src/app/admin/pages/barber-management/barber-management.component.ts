import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router, RouterModule } from '@angular/router';
import { BarberService, Barber } from '../../../services/barber.service';
import { BarberFormDialogComponent } from '../../components/barber-form-dialog/barber-form-dialog.component'; 
@Component({
  selector: 'app-barber-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSlideToggleModule
  ],
  templateUrl: './barber-management.component.html',
  styleUrls: ['./barber-management.component.css']
})
export class BarberManagementComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['image', 'name', 'locationName', 'rating', 'isActive', 'actions']; 
  dataSource: (Barber & { locationName: string })[] = []; 
  private barberSub: Subscription | undefined;
  constructor(
    private barberService: BarberService,
    private dialog: MatDialog,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.barberSub = this.barberService.barbers$.subscribe(() => {
      this.dataSource = this.barberService.getBarbersWithLocationName(true);
    });
  }
  ngOnDestroy(): void {
    this.barberSub?.unsubscribe();
  }
  openDialog(barber?: Barber): void {
    const dialogRef = this.dialog.open(BarberFormDialogComponent, {
      width: '500px',
      data: barber 
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.barberService.updateBarber(result);
        } else {
          this.barberService.createBarber(result);
        }
      }
    });
  }
  toggleActive(barber: Barber): void {
    const updatedBarber: Barber = { ...barber, isActive: !barber.isActive };
    this.barberService.updateBarber(updatedBarber);
  }
  deleteBarber(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este barbero?')) {
      this.barberService.deleteBarber(id);
    }
  }
  goToSchedule(barberId: number): void {
    this.router.navigate(['/admin/barberos/horarios', barberId]);
  }
}