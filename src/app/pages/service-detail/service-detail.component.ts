import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { UiStateService } from '../../services/ui-state.service';
@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {
  service: any;
  constructor(
    private route: ActivatedRoute,
    private serviceService: ServiceService,
    private uiStateService: UiStateService
  ) {}
  ngOnInit(): void {
    const serviceId = this.route.snapshot.paramMap.get('id');
    if (serviceId) {
      this.service = this.serviceService.getServiceById(+serviceId);
      if (this.service) {
        this.uiStateService.setHeroState({
          type: 'banner',
          title: this.service.name.toUpperCase(),
          imageUrl: this.service.imageUrl
        });
      }
    }
  }
}