import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LocationService } from '../../services/location.service';
import { BarberService } from '../../services/barber.service';
import { BarbersDialogComponent } from '../barbers-dialog/barbers-dialog.component';
@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule],
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {
  locations: any[] = [];
  constructor(
    private locationService: LocationService,
    private barberService: BarberService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.locations = this.locationService.getLocations();
  }
  showBarbers(location: any): void {
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