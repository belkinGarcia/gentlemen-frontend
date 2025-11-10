import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ServiceService, Service, Category } from '../../../services/service.service';
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
  displayedColumns: string[] = ['name', 'category', 'price', 'duration', 'actions'];
  dataSource: Service[] = [];
  private serviceSub: Subscription | undefined;
  constructor(
    private serviceService: ServiceService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.serviceSub = this.serviceService.categories$.subscribe(categories => {
      this.dataSource = categories.flatMap(cat => 
        cat.items.map(item => ({ ...item, category: cat.category })) as Service[]
      );
    });
  }
  ngOnDestroy(): void {
    this.serviceSub?.unsubscribe();
  }
  openDialog(service?: Service): void {
    const dialogRef = this.dialog.open(ServiceFormDialogComponent, {
      width: '500px',
      data: service
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