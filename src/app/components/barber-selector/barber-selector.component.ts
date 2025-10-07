import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-barber-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './barber-selector.component.html',
  styleUrls: ['./barber-selector.component.css']
})
export class BarberSelectorComponent {
  @Input() barbers: any[] = [];
  @Input() selectedBarberId: number | null = null;
  @Output() selectionChange = new EventEmitter<any>();

  selectBarber(barber: any) {
    this.selectionChange.emit(barber);
  }
}