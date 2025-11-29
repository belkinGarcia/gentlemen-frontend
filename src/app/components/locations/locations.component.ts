import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LocationService, Location } from '../../services/location.service'; // Importar Location
import { BarberService } from '../../services/barber.service';
import { BarbersDialogComponent } from '../barbers-dialog/barbers-dialog.component';
import { Observable } from 'rxjs'; // Importar Observable

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule],
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {
  // 💡 CAMBIO CLAVE: Ahora es un Observable, no un array estático.
  locations$: Observable<Location[]>;

  // No necesitas el array locations: any[] = [];

  constructor(
    private locationService: LocationService,
    private barberService: BarberService,
    public dialog: MatDialog
  ) {
    // 💡 Asignamos el observable del servicio en el constructor (o ngOnInit)
    this.locations$ = this.locationService.locations$;
  }

  ngOnInit(): void {
    // Eliminamos la asignación síncrona: this.locations = this.locationService.getLocations();
    // La suscripción la manejará el pipe 'async' en el HTML.
  }

  showBarbers(location: Location): void { // Asegúrate de que el tipo sea Location
    const barbers = this.barberService.getBarbersByLocationId(location.id);
    this.dialog.open(BarbersDialogComponent, {
      data: {
        barbers: barbers,
        locationName: location.name
      },
      width: '800px',
      maxWidth: '900px',
      panelClass: 'square-dialog'
    });
  }
}
