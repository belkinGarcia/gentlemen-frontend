import { Component, OnInit, ViewChild,  ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LocationService } from '../../services/location.service';
import { ServiceService } from '../../services/service.service';
import { BarberService } from '../../services/barber.service';
import { BarberSelectorComponent } from '../barber-selector/barber-selector.component';
import { ScheduleService } from '../../services/schedule.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AccountPageComponent } from '../../pages/account-page/account-page.component';

// Le decimos a TypeScript que estas librerías existirán en el entorno global
declare var html2canvas: any;

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule, MatStepperModule, MatButtonModule, MatIconModule, BarberSelectorComponent,
    MatDatepickerModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatCheckboxModule, AccountPageComponent
  ],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  encapsulation: ViewEncapsulation.None 
})
export class BookingComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;

  locations: any[] = [];
  selectedLocation: any | null = null;
  servicesByCategory: any[] = [];
  serviceStepView: 'categories' | 'services' = 'categories';
  selectedCategoryServices: any[] = [];
  selectedService: any | null = null;
  minDate: Date; 
  selectedDate: Date | null = null;
  selectedTime: string | null = null;
  availableTimes: string[] = [];
  barbersForLocation: any[] = [];
  selectedBarber: any | null = null;
  informationForm!: FormGroup;
  confirmationNumber: string = '';

  constructor(
    private locationService: LocationService,
    private serviceService: ServiceService,
    private barberService: BarberService,
    private scheduleService: ScheduleService,
    private fb: FormBuilder,
  ) { this.minDate = new Date(); }

  ngOnInit(): void {
    this.locations = this.locationService.getLocations();
    this.servicesByCategory = this.serviceService.getServicesByCategory();
    this.informationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dni: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
  }

  selectLocation(location: any): void { this.selectedLocation = location; }
  selectCategory(category: any): void { this.selectedCategoryServices = category.items; this.serviceStepView = 'services'; }
  selectService(service: any): void { this.selectedService = service; }
  backToCategories(): void { this.serviceStepView = 'categories'; this.selectedService = null; }
  
  onStepChange(event: StepperSelectionEvent): void { 
    if (event.selectedIndex === 2 && this.selectedLocation) { 
      this.barbersForLocation = this.barberService.getBarbersByLocationId(this.selectedLocation.id, true); 
      this.selectedBarber = null; 
    } 
  }

  selectBarber(barber: any): void { this.selectedBarber = barber; }
  
  onDateSelect(date: Date | null): void { 
    if (date) { 
      this.selectedDate = date; 
      this.selectedTime = null; 
      this.availableTimes = this.scheduleService.getAvailableTimesForDate(date); 
    } 
  }

  selectTime(time: string): void { this.selectedTime = time; }
  
  dateClass = (d: Date): string => { 
    return this.scheduleService.isDateUnavailable(d) ? 'unavailable-date' : 'available-date'; 
  }
  
  handleAuthentication(userDataFromChild: any): void { 
    let fullUserData; 
    if (userDataFromChild.firstName) { 
      fullUserData = userDataFromChild; 
    } else { 
      console.log('Es un login...'); 
      fullUserData = { 
        firstName: 'Juan', 
        lastName: 'Pérez', 
        dni: '12345678', 
        email: userDataFromChild.email, 
        phone: '987654321' 
      }; 
    } 
    this.informationForm.patchValue(fullUserData); 
    console.log('Nuevo estado de informationForm:', this.informationForm.status); 
  }

  confirmAppointment(): void {
    if (this.informationForm.valid) {
      this.confirmationNumber = Math.floor(100000 + Math.random() * 900000).toString();
      this.stepper.next();
    }
  }

  downloadConfirmationAsPDF(): void {
    setTimeout(() => {
      const contentToCapture = document.getElementById('pdf-ticket');

      if (contentToCapture) {
        html2canvas(contentToCapture, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
          .then((canvas: HTMLCanvasElement) => {
            // Lógica para blanco y negro
            const ctx = canvas.getContext('2d');
            if (ctx) {
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const data = imageData.data;
              for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = avg; data[i + 1] = avg; data[i + 2] = avg;
              }
              ctx.putImageData(imageData, 0, 0);
            }

            const imgData = canvas.toDataURL('image/png');
            
            // ***** LA CORRECCIÓN MÁS IMPORTANTE ESTÁ AQUÍ *****
            // Accedemos a jsPDF a través del objeto 'window'
            const { jsPDF } = (window as any).jspdf;
            const pdf = new jsPDF({
              orientation: 'portrait',
              unit: 'pt',
              format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`Confirmacion-Cita-${this.confirmationNumber}.pdf`);
          })
          .catch((error: any) => {
            console.error("¡ERROR! Ocurrió un problema al generar el canvas o el PDF:", error);
          });
      } else {
        console.error("Error Crítico: No se pudo encontrar el elemento #pdf-ticket.");
      }
    }, 100); // Aumentamos ligeramente la espera por si acaso
  }
}

