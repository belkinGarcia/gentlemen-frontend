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
  mainForm!: FormGroup; 
  contentData: ContentData = {}; 
  activeStepKey: string = 'contact';
  private contentSub: Subscription | undefined;
  currentStepData: StepGuide = { title: '', description: '' }; 
  isContactView: boolean = true; 
  constructor(
    private fb: FormBuilder,
    private contentService: ContentService
  ) {}
ngOnInit(): void {
    this.mainForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      whatsappNumber: [''],
      whatsappLink: ['']
    });

    this.contentService.loadFromBackend();

this.contentSub = this.contentService.content$.subscribe(data => {
      if (data && Object.keys(data).length > 0) {
        this.contentData = data;
        this.loadStepForm(this.activeStepKey); 
      }
    });
  }
  ngOnDestroy(): void {
    this.contentSub?.unsubscribe();
  }
  loadStepForm(key: string): void {
    this.activeStepKey = key;
    const stepData = this.contentData[key] ?? { title: '', description: '', whatsappNumber: '', whatsappLink: '' };
    this.isContactView = (key === 'contact');
    this.currentStepData = stepData; 
    this.mainForm.patchValue({
      title: stepData.title,
      description: stepData.description,
      whatsappNumber: stepData.whatsappNumber || '', 
      whatsappLink: stepData.whatsappLink || ''
    });
    if (this.isContactView) {
      this.mainForm.get('whatsappNumber')?.setValidators(Validators.required);
      this.mainForm.get('whatsappLink')?.setValidators(Validators.required);
    } else {
      this.mainForm.get('whatsappNumber')?.clearValidators();
      this.mainForm.get('whatsappLink')?.clearValidators();
      this.mainForm.patchValue({ whatsappNumber: '', whatsappLink: '' }); 
    }
    this.mainForm.updateValueAndValidity();
  }
  saveGuide(): void {
    if (this.mainForm.valid) {
      const formValue = this.mainForm.value;
      const guideToSave: StepGuide = {
        title: formValue.title,
        description: formValue.description,
      };
      if (this.isContactView) {
        guideToSave.whatsappNumber = formValue.whatsappNumber;
        guideToSave.whatsappLink = formValue.whatsappLink;
      }
      this.contentService.updateGuide(this.activeStepKey, guideToSave);
      alert(`Guía para '${this.getStepTitle(this.activeStepKey)}' actualizada.`);
    } else {
      this.mainForm.markAllAsTouched();
    }
  }
  getStepTitle(key: string): string {
    const data = this.contentData[key];
    if (data && data.title) {
        return data.title;
    }
    return key === 'contact' ? 'Información de Contacto' : `Paso ${key.slice(-1)}`;
  }
  getStepKeys(): string[] {
    return ['step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'contact'];
  }
}