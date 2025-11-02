// src/app/admin/pages/location-management/location-management.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LocationService, Location } from '../../../services/location.service'; // Ajusta la ruta

import { LocationFormDialogComponent } from '../../components/location-form-dialog/location-form-dialog.component';

@Component({
  selector: 'app-location-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './location-management.component.html',
  styleUrls: ['./location-management.component.css']
})
export class LocationManagementComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['imageUrl', 'name', 'address', 'phone', 'actions'];
  dataSource: Location[] = [];
  private locationSub: Subscription | undefined;

  constructor(
    private locationService: LocationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Se suscribe al observable para que la tabla se actualice sola
    this.locationSub = this.locationService.locations$.subscribe(locations => {
      this.dataSource = locations;
    });
  }

  ngOnDestroy(): void {
    this.locationSub?.unsubscribe();
  }

  // --- LÓGICA DE DIÁLOGO ---

  openDialog(location?: Location): void {
    const dialogRef = this.dialog.open(LocationFormDialogComponent, {
      width: '600px',
      data: location
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Enviar a los métodos CRUD
        if (result.id) {
          this.locationService.updateLocation(result);
        } else {
          this.locationService.createLocation(result);
        }
      }
    });
  }

  deleteLocation(id: number, name: string): void {
    if (confirm(`ADVERTENCIA: ¿Estás seguro de eliminar la sede "${name}"? Esto afectará a todos los barberos asignados.`)) {
      this.locationService.deleteLocation(id);
    }
  }
}