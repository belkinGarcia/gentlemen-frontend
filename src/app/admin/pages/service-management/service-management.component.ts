// src/app/admin/pages/service-management/service-management.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ServiceService, Service, Category } from '../../../services/service.service'; // Ajusta la ruta

import { ServiceFormDialogComponent } from '../../components/service-form-dialog/service-form-dialog.component';

@Component({
  selector: 'app-service-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './service-management.component.html',
  styleUrls: ['./service-management.component.css']
})
export class ServiceManagementComponent implements OnInit, OnDestroy {

  // La tabla mostrará una lista plana de todos los servicios
  displayedColumns: string[] = ['name', 'category', 'price', 'duration', 'actions'];
  dataSource: Service[] = [];
  private serviceSub: Subscription | undefined;

  constructor(
    private serviceService: ServiceService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Nos suscribimos al observable de categorías del servicio
    this.serviceSub = this.serviceService.categories$.subscribe(categories => {
      // Aplanamos las categorías en una sola lista de servicios para la tabla
      this.dataSource = categories.flatMap(cat => 
        cat.items.map(item => ({ ...item, category: cat.category })) as Service[]
      );
    });
  }

  ngOnDestroy(): void {
    this.serviceSub?.unsubscribe();
  }

  // --- LÓGICA DE DIÁLOGO ---

  openDialog(service?: Service): void {
    const dialogRef = this.dialog.open(ServiceFormDialogComponent, {
      width: '500px',
      data: service // Pasa el servicio si es edición
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.serviceService.updateService(result);
        } else {
          this.serviceService.createService(result);
        }
      }
    });
  }

  deleteService(service: Service): void {
    if (confirm(`¿Estás seguro de que quieres eliminar el servicio "${service.name}"?`)) {
      this.serviceService.deleteService(service);
    }
  }
}