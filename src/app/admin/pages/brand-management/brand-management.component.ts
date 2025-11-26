import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrandService, Marca } from '../../../services/brand.service';
import { BrandFormDialogComponent } from '../../components/brand-form-dialog/brand-form-dialog.component';

@Component({
  selector: 'app-brand-management',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './brand-management.component.html',
  styleUrls: ['./brand-management.component.css']
})
export class BrandManagementComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'actions'];
  dataSource: Marca[] = [];

  constructor(private brandService: BrandService, private dialog: MatDialog) {}

  ngOnInit(): void { this.loadBrands(); }

  loadBrands(): void {
    this.brandService.getAll().subscribe(data => this.dataSource = data);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(BrandFormDialogComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.brandService.create(result).subscribe(() => this.loadBrands());
    });
  }

  openEditDialog(marca: Marca): void {
    const dialogRef = this.dialog.open(BrandFormDialogComponent, { width: '400px', data: marca });
    dialogRef.afterClosed().subscribe(result => {
      if (result && marca.idMarca) {
        this.brandService.update(marca.idMarca, result).subscribe(() => this.loadBrands());
      }
    });
  }

  deleteBrand(id: number): void {
    if (confirm('¿Eliminar esta marca?')) {
      this.brandService.delete(id).subscribe(() => this.loadBrands());
    }
  }
}