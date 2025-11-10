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
    const unsafeUrl = "https://www.youtube.com/embed/qKhkeEz9k1Y?autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1";
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
  }
  openVideoDialog(): void {
    this.dialog.open(VideoPlayerDialogComponent, {
      width: '90vw',
      maxWidth: '1200px',
      height: '90vh',
      panelClass: 'video-dialog-container',
      data: { videoUrl: this.videoUrl } 
    });
  }
}
@Component({
  selector: 'app-video-player-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
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
    <button mat-icon-button class="close-button" mat-dialog-close>
      <mat-icon>close</mat-icon>
    </button>
  `,
  styles: [`
    :host { 
      display: flex; 
      flex-direction: column; 
      height: 100%;
      background: #000;
      position: relative; 
      overflow: hidden !important; 
    }
    mat-dialog-content { 
      padding: 0; 
      flex-grow: 1; 
      overflow: hidden !important; 
      display: flex; 
    }
    iframe { 
      width: 100%; 
      height: 100%; 
      display: block; 
      border: 1cm solid #1a1a1a; 
      box-sizing: border-box;    
    }
    .close-button {
      position: absolute;
      top: -25px; 
      right: -25px; 
      z-index: 10;
      color: white;
      background-color: rgba(0, 0, 0, 0.7);
      border-radius: 50%;
      width: 40px; 
      height: 40px; 
      font-size: 24px; 
    }
    .close-button mat-icon {
        font-size: 24px;
        line-height: 1;
    }
  `]
})
export class VideoPlayerDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { videoUrl: SafeResourceUrl }) {}
}