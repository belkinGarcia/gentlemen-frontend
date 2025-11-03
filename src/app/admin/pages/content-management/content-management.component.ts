// src/app/admin/pages/content-management/content-management.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ContentService, ContentData, StepGuide } from '../../../services/content.service';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-content-management',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatDividerModule, MatFormFieldModule, ReactiveFormsModule,
    MatInputModule, MatButtonModule, MatIconModule
  ],
  templateUrl: './content-management.component.html',
  styleUrls: ['./content-management.component.css']
})
export class ContentManagementComponent implements OnInit, OnDestroy {

  // Eliminamos 'contactForm' y usamos solo 'mainForm'
  mainForm!: FormGroup; 
  contentData: ContentData = {}; 
  activeStepKey: string = 'contact'; 

  private contentSub: Subscription | undefined;
  
  currentStepData: StepGuide = { title: '', description: '' }; 

  // Definimos los campos que solo el contacto necesita
  isContactView: boolean = true; 

  constructor(
    private fb: FormBuilder,
    private contentService: ContentService
  ) {}

  ngOnInit(): void {
    // 1. Inicializa el formulario principal con TODOS los posibles campos
    this.mainForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      // Estos campos serán requeridos solo si 'isContactView' es true
      whatsappNumber: [''],
      whatsappLink: ['']
    });

    // 2. Suscribe para recibir y cargar los datos
    this.contentSub = this.contentService.content$.subscribe(data => {
      this.contentData = data;
      // Recarga el formulario con los nuevos datos recibidos
      // Nota: Aquí cambié 'contact' a 'step3' para mostrar un ejemplo de paso de booking en la carga inicial.
      // Puedes ajustarlo al paso que quieras que se abra por defecto.
      this.loadStepForm('step3'); 
    });
  }

  ngOnDestroy(): void {
    this.contentSub?.unsubscribe();
  }

  // Carga el formulario dinámico
  loadStepForm(key: string): void {
    this.activeStepKey = key;
    // Usamos el operador de nullish coalescing (??) para asegurar un objeto StepGuide
    const stepData = this.contentData[key] ?? { title: '', description: '', whatsappNumber: '', whatsappLink: '' };
    
    // 1. Determina si mostrar los campos de WhatsApp
    this.isContactView = (key === 'contact');

    // 2. Almacena los datos para el título de la tarjeta
    this.currentStepData = stepData; 

    // 3. Carga los valores del paso seleccionado
    this.mainForm.patchValue({
      title: stepData.title,
      description: stepData.description,
      whatsappNumber: stepData.whatsappNumber || '', 
      whatsappLink: stepData.whatsappLink || ''
    });

    // 4. Actualiza la validez (WhatsApp es requerido solo en la vista de Contacto)
    if (this.isContactView) {
      this.mainForm.get('whatsappNumber')?.setValidators(Validators.required);
      this.mainForm.get('whatsappLink')?.setValidators(Validators.required);
    } else {
      // Limpia los validadores y limpia los valores de WhatsApp si no es contacto
      this.mainForm.get('whatsappNumber')?.clearValidators();
      this.mainForm.get('whatsappLink')?.clearValidators();
      this.mainForm.patchValue({ whatsappNumber: '', whatsappLink: '' }); 
    }
    this.mainForm.updateValueAndValidity();
  }

  // Función unificada de guardado
  saveGuide(): void {
    if (this.mainForm.valid) {
      const formValue = this.mainForm.value;

      // 1. Prepara el objeto a guardar, incluyendo solo los campos relevantes
      const guideToSave: StepGuide = {
        title: formValue.title,
        description: formValue.description,
      };

      // 2. Si es contacto, añade los campos de WhatsApp
      if (this.isContactView) {
        guideToSave.whatsappNumber = formValue.whatsappNumber;
        guideToSave.whatsappLink = formValue.whatsappLink;
      }
      
      // 3. Llama al servicio para actualizar la clave activa
      this.contentService.updateGuide(this.activeStepKey, guideToSave);
      
      alert(`Guía para '${this.getStepTitle(this.activeStepKey)}' actualizada.`);
    } else {
      this.mainForm.markAllAsTouched();
    }
  }

  getStepTitle(key: string): string {
    const data = this.contentData[key];
    // Usamos el título del data si existe, sino lo formateamos a partir de la clave
    if (data && data.title) {
        return data.title;
    }
    return key === 'contact' ? 'Información de Contacto' : `Paso ${key.slice(-1)}`;
  }

  // Agregamos la clave 'contact' para el botón de navegación
  getStepKeys(): string[] {
    return ['step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'contact'];
  }
}