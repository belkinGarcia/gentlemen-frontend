import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookingComponent } from '../booking/booking.component'; 
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-info-section',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterModule 
  ],
  templateUrl: './info-section.component.html',
  styleUrls: ['./info-section.component.css']
})
export class InfoSectionComponent {
  constructor(public dialog: MatDialog) {}
  openBookingDialog(): void {
    this.dialog.open(BookingComponent, {
      width: '90%',
      maxWidth: '1200px',
      panelClass: 'custom-dialog-container'
    });
  }
}