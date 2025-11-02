import { Component, OnInit } from '@angular/core';
import { UiStateService } from '../../services/ui-state.service';
import { LocationsComponent } from '../../components/locations/locations.component';
import { VideoCtaComponent } from '../../components/video-cta/video-cta.component';
import { InfoSectionComponent } from '../../components/info-section/info-section.component';

@Component({
  selector: 'app-locations-page',
  standalone: true,
  imports: [
    LocationsComponent,
    InfoSectionComponent,
    VideoCtaComponent 
  ],
  templateUrl: './locations-page.component.html',
  styleUrls: ['./locations-page.component.css']
})
export class LocationsPageComponent implements OnInit {
  constructor(private uiStateService: UiStateService) {}

  ngOnInit(): void {
    this.uiStateService.setHeroState({
      type: 'banner',
      title: 'NUESTRAS SEDES',
      imageUrl: 'https://cdn.midjourney.com/c0d03bc8-50cc-4dc3-9199-1abd30f85020/0_0.png'
    });
  }

  
}