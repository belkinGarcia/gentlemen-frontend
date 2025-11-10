import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiStateService } from '../../services/ui-state.service';
import { InfoSectionComponent } from '../../components/info-section/info-section.component';
@Component({
  selector: 'app-terms-page',
  standalone: true,
  imports: [CommonModule, InfoSectionComponent],
  templateUrl: './terms-page.component.html',
  styleUrls: ['./terms-page.component.css']
})
export class TermsPageComponent implements OnInit {
  constructor(private uiStateService: UiStateService) {}
  ngOnInit(): void {
    this.uiStateService.setHeroState({
      type: 'banner',
      title: 'Términos y Condiciones',
      imageUrl: 'https://cdn.midjourney.com/c0d03bc8-50cc-4dc3-9199-1abd30f85020/0_0.png'
    });
  }
}