import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-barbers-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, RouterModule],
  templateUrl: './barbers-dialog.component.html',
  styleUrls: ['./barbers-dialog.component.css']
})
export class BarbersDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { barbers: any[], locationName: string },
    public dialogRef: MatDialogRef<BarbersDialogComponent>
  ) {}
  onBarberClick(): void {
    this.dialogRef.close();
  }
}