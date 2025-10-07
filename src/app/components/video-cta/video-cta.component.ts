import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  MatDialog,
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

// --- This is the component for the banner with the "VER VIDEO" button ---
@Component({
  selector: 'app-video-cta',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './video-cta.component.html',
  styleUrls: ['./video-cta.component.css']
})
export class VideoCtaComponent {
  videoUrl: SafeResourceUrl;

constructor(public dialog: MatDialog, private sanitizer: DomSanitizer) {
  // This is the special URL for embedding
  this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/qKhkeEz9k1Y");
}

  openVideoDialog(): void {
    this.dialog.open(VideoPlayerDialogComponent, {
      width: '90vw',
      maxWidth: '1200px',
      height: '90vh',
      panelClass: 'video-dialog-container',
      data: { videoUrl: this.videoUrl } // Pass the safe URL to the dialog
    });
  }
}


// --- This is the component that will be displayed INSIDE the dialog pop-up ---
@Component({
  selector: 'app-video-player-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule // This module is required for the dialog template elements
  ],
  template: `
    <mat-dialog-content>
      <iframe 
        width="100%" 
        height="100%" 
        [src]="data.videoUrl" 
        frameborder="0" 
        allow="autoplay; encrypted-media" 
        allowfullscreen>
      </iframe>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close cdkFocusInitial>Cerrar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; height: 100%; }
    mat-dialog-content { padding: 0; flex-grow: 1; }
    iframe { width: 100%; height: 100%; border: none; }
    mat-dialog-actions { padding: 8px 16px; background-color: #212121; }
    mat-dialog-actions button { color: #fff; }
  `]
})
export class VideoPlayerDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { videoUrl: SafeResourceUrl }) {}
}