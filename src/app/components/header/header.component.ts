import { Component, HostListener, HostBinding } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookingComponent } from '../booking/booking.component';
import { MatMenuModule } from '@angular/material/menu'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule,
    RouterModule
],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  // This will bind the 'opacity' style of the host element (app-header)
  // to the value of the 'opacity' property in this class.
  @HostBinding('style.opacity') opacity = 1;

  constructor(public dialog: MatDialog) {}

  // This listens for the 'scroll' event on the global 'window' object.
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    const verticalOffset = window.pageYOffset
      || document.documentElement.scrollTop
      || document.body.scrollTop || 0;

    // Fades out over the first 300 pixels of scrolling
    const maxScroll = 300;
    const newOpacity = 1 - (verticalOffset / maxScroll);

    // We use Math.max to ensure the opacity doesn't go below 0
    this.opacity = Math.max(0, newOpacity);
  }

  openBookingDialog(): void {
    this.dialog.open(BookingComponent, {
      width: '90%',
      maxWidth: '1200px',
      panelClass: 'custom-dialog-container'
    });
  }
}