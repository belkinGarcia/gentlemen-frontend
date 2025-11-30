import { Component, OnInit, ViewChild, ViewEncapsulation, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LocationService } from '../../services/location.service';
import { Category, Service, ServiceService } from '../../services/service.service';
import { BarberService } from '../../services/barber.service';
import { BarberSelectorComponent } from '../barber-selector/barber-selector.component';
import { ScheduleService } from '../../services/schedule.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthPageComponent } from '../../pages/auth-page/auth-page.component';
import { AuthService } from '../../services/auth.service';
import { ReservationService, Reservation, ReservationData } from '../../services/reservation.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

declare var html2canvas: any;

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule, MatStepperModule, MatButtonModule, MatIconModule, BarberSelectorComponent,
    MatDatepickerModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatCheckboxModule, AuthPageComponent, MatDividerModule, MatProgressSpinnerModule
  ],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BookingComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  
  locations: any[] = [];
  selectedLocation: any | null = null;
  servicesByCategory: Category[] = [];
  serviceStepView: 'categories' | 'services' = 'categories';
  selectedCategoryServices: Service[] = [];
  public selectedService: Service | null = null;
  minDate: Date;
  selectedDate: Date | null = null;
  selectedTime: string | null = null;
  availableTimes: string[] = [];
  barbersForLocation: any[] = [];
  public selectedBarber: any | null = null;
  informationForm!: FormGroup;
  confirmationNumber: string = '';
  totalDuration: number = 0;
  private oldReservationIdToCancel: string | null = null;

  // Bandera para evitar múltiples envíos automáticos
  isProcessingReservation: boolean = false;

  constructor(
    private locationService: LocationService,
    private serviceService: ServiceService,
    private barberService: BarberService,
    private scheduleService: ScheduleService,
    private fb: FormBuilder,
    private authService: AuthService,
    private reservationService: ReservationService,
    public dialogRef: MatDialogRef<BookingComponent>,
    private router: Router,
    public contentService: ContentService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { this.minDate = new Date(); }

  ngOnInit(): void {
    this.serviceService.loadCategories();
    this.barberService.loadAllBarbers();
    this.locations = this.locationService.getLocations();
    this.serviceService.categories$.subscribe(categories => {
      this.servicesByCategory = categories;
    });
    
    this.informationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dni: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });

    if (this.data && this.data.isReschedule) {
      const oldRes: Reservation = this.data.reservationData;
      this.oldReservationIdToCancel = oldRes.confirmationNumber;
      this.selectedLocation = oldRes.location;
      if (this.selectedService) {
        this.totalDuration = this.selectedService.duration || 30; 
      }
      this.selectedBarber = oldRes.barber;
      this.totalDuration = (oldRes.service as Service).duration;
      setTimeout(() => {
        this.stepper.selectedIndex = 0;
      }, 0);
    }
  }

  // --- Getters y Métodos de Selección ---

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  selectLocation(location: any): void { this.selectedLocation = location; }
  selectCategory(category: Category): void { this.selectedCategoryServices = category.items; this.serviceStepView = 'services'; }
  
  selectService(service: Service): void {
    this.selectedService = service;
    this.totalDuration = service.duration;
  }
  
  backToCategories(): void { this.serviceStepView = 'categories'; this.selectedService = null; }

  selectBarber(barber: any): void {
    this.selectedBarber = barber;
    this.selectedDate = null;
    this.selectedTime = null;
    this.availableTimes = [];
  }

  onDateSelect(date: Date | null): void {
    const defaultDuration = 30;
    let appointmentDuration = defaultDuration;
    if (date && this.selectedBarber) {
      if (this.selectedService) {
        appointmentDuration = this.selectedService.duration;
      }
      this.selectedDate = date;
      this.selectedTime = null;
      this.availableTimes = this.scheduleService.getAvailableTimesFor(
        date,
        this.selectedBarber.id,
        appointmentDuration
      );
    } else {
      this.availableTimes = [];
    }
  }

  selectTime(time: string): void { this.selectedTime = time; }
  
  dateClass = (d: Date): string => {
    return this.scheduleService.isDateUnavailable(d) ? 'unavailable-date' : 'available-date';
  }

  // --- LÓGICA PRINCIPAL DEL STEPPER (Aquí está la magia) ---

  onStepChange(event: StepperSelectionEvent): void {
    // Paso 2: Barbero
    if (event.selectedIndex === 2 && this.selectedLocation) {
      this.barbersForLocation = this.barberService.getBarbersByLocationId(this.selectedLocation.id, true);
      if (!this.data?.isReschedule) {
        this.selectedBarber = null;
      }
    }

    // Paso 4: Información (Índice 4)
    if (event.selectedIndex === 4) {
      if (this.isLoggedIn) {
        const currentUser = this.authService.getCurrentUser();

        if (currentUser) {
          // Detectamos si falta información crucial en el localStorage (ej: DNI o Celular)
          // Nota: Comprobamos 'phone' y 'celular' por la diferencia de nombres ES/EN
          const isDataMissing = !currentUser.dni || (!currentUser.phone && !currentUser.celular);

          if (isDataMissing) {
            console.log("Faltan datos en local. Consultando BD...");
            
            // 1. Recuperamos datos completos del Backend
            this.authService.getCompleteUserProfile(currentUser.id || currentUser.id_usuario || currentUser.idUsuario).subscribe({
              next: (fullUserFromDb) => {
                // 2. Actualizamos el usuario local con los datos frescos
                const updatedUser = {
                  ...currentUser,
                  firstName: fullUserFromDb.nombres,
                  lastName: fullUserFromDb.apellidos,
                  dni: fullUserFromDb.dni,
                  email: fullUserFromDb.email || fullUserFromDb.correo,
                  phone: fullUserFromDb.celular,
                  celular: fullUserFromDb.celular
                };
                
                this.authService.updateUser(updatedUser); // Guardamos en localStorage

                // 3. Llenamos el formulario
                this.informationForm.patchValue(updatedUser);
                
                // 4. Intentamos avanzar
                this.autoAdvanceIfValid();
              },
              error: (err) => {
                console.error("No se pudo recuperar datos de la BD", err);
                // Si falla, no hacemos nada; el HTML mostrará el formulario manual.
              }
            });

          } else {
            // Si ya tenemos todo, mapeamos directamente
            const userDataMapped = {
              firstName: currentUser.firstName || currentUser.nombres,
              lastName: currentUser.lastName || currentUser.apellidos,
              dni: currentUser.dni,
              email: currentUser.email || currentUser.correo,
              phone: currentUser.phone || currentUser.celular
            };
            this.informationForm.patchValue(userDataMapped);
            this.autoAdvanceIfValid();
          }
        }
      }
    }

    // Paso 5: Confirmación (Protección manual)
    if (event.selectedIndex === 5) {
      // Si intentan llegar aquí sin validar el form, los devolvemos
      if (!this.informationForm.valid || !this.isLoggedIn) {
        setTimeout(() => {
          this.stepper.selectedIndex = 4;
        }, 0);
      }
    }
  }

  // Método auxiliar para avanzar automáticamente si todo está OK
  private autoAdvanceIfValid(): void {
    if (this.informationForm.valid && !this.isProcessingReservation) {
      this.isProcessingReservation = true;
      this._saveReservation();
      
      // Delay visual para ver el check o spinner un momento
      setTimeout(() => {
        this.stepper.selectedIndex = 5;
        this.isProcessingReservation = false;
      }, 500);
    }
  }

  // Maneja el login/registro desde el componente hijo (AuthPage)
  handleAuthentication(userDataFromChild: any): void {
    // Mapeamos los datos recibidos (que pueden venir en formato backend o frontend)
    const mappedData = {
        firstName: userDataFromChild.firstName || userDataFromChild.nombres,
        lastName: userDataFromChild.lastName || userDataFromChild.apellidos,
        dni: userDataFromChild.dni,
        email: userDataFromChild.email || userDataFromChild.correo,
        phone: userDataFromChild.phone || userDataFromChild.celular
    };

    this.informationForm.patchValue(mappedData);
    
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
        const updatedUser = { ...currentUser, ...mappedData };
        this.authService.updateUser(updatedUser);
    }
    setTimeout(() => {
        if (this.informationForm.valid) {
          this.confirmAppointment();
        }
    }, 200);
  }

  // Acción del botón "Siguiente" manual
  confirmAppointment(): void {
    if (this.informationForm.valid) {
      if (!this.authService.isLoggedIn()) {
        // Si por alguna razón llega aquí sin login (raro), guardamos igual
        this._saveReservation();
      } else {
        // Flujo normal logueado manual
        this._saveReservation();
      }
      this.stepper.next();
    } else {
      this.informationForm.markAllAsTouched();
    }
  }

  private _saveReservation(): void {
    if (!this.confirmationNumber) {
        this.confirmationNumber = Math.floor(100000 + Math.random() * 900000).toString();
    }

    const currentUser = this.authService.getCurrentUser();

    const newReservationData: ReservationData = {
      location: this.selectedLocation,
      service: this.selectedService,
      barber: this.selectedBarber,
      date: this.selectedDate,
      time: this.selectedTime,
      user: {
          firstName: this.informationForm.value.firstName,
          lastName: this.informationForm.value.lastName,
          dni: this.informationForm.value.dni,
          email: this.informationForm.value.email,
          phone: this.informationForm.value.phone,
          // IMPORTANTE: Enviar el ID del usuario logueado
          id: currentUser ? (currentUser.id || currentUser.idUsuario) : null 
      },      
      confirmationNumber: this.confirmationNumber


    };
    
    this.reservationService.createReservation(newReservationData);
    
    if (this.oldReservationIdToCancel) {
      this.reservationService.cancelReservation(this.oldReservationIdToCancel);
      this.oldReservationIdToCancel = null;
    }
  }

  downloadConfirmationAsPDF(): void {
    setTimeout(() => {
      const contentToCapture = document.getElementById('pdf-ticket');
      if (contentToCapture) {
        html2canvas(contentToCapture, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
          .then((canvas: HTMLCanvasElement) => {
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
            const { jsPDF } = (window as any).jspdf;
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: [canvas.width, canvas.height] });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`Confirmacion-Cita-${this.confirmationNumber}.pdf`);
          });
      }
    }, 100);
  }

  closeAndNavigateToReservations(): void {
    this.dialogRef.close();
    this.router.navigate(['/mi-cuenta/reservas']);
  }
}