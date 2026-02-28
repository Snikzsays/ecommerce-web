import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OnboardingStoreService } from '../../../services/onboarding-store.service';

@Component({
  selector: 'app-onboarding-business-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule
  ],
  template: `
    <div class="onboarding-step">
      <div class="step-content">
        <div class="header-section">
          <h2>Business details</h2>
          <p class="subtitle">Help us understand your business better</p>
        </div>

        <form [formGroup]="businessDetailsForm" (ngSubmit)="onNext()">
          
          <mat-form-field class="full-width" appearance="outline">
            <mat-label>Legal Business Name <span class="required">*</span></mat-label>
            <input 
              matInput 
              formControlName="legalBusinessName"
              placeholder="Enter your legal business name">
            @if (businessDetailsForm.get('legalBusinessName')?.invalid && businessDetailsForm.get('legalBusinessName')?.touched) {
              <mat-error>Legal business name is required</mat-error>
            }
          </mat-form-field>

          <mat-form-field class="full-width" appearance="outline">
            <mat-label>GST Number (Optional)</mat-label>
            <input 
              matInput 
              formControlName="gstNumber"
              placeholder="E.G., 27XXXXX1234X1Z5"
              maxlength="15">
          </mat-form-field>

          <mat-form-field class="full-width" appearance="outline">
            <mat-label>Owner Name <span class="required">*</span></mat-label>
            <input 
              matInput 
              formControlName="ownerName"
              placeholder="Enter owner's full name">
            @if (businessDetailsForm.get('ownerName')?.invalid && businessDetailsForm.get('ownerName')?.touched) {
              <mat-error>Owner name is required</mat-error>
            }
          </mat-form-field>

          <div class="whatsapp-section">
            <mat-form-field class="full-width" appearance="outline">
              <mat-label>WhatsApp Business Number <span class="required">*</span></mat-label>
              <div matPrefix class="prefix">+91</div>
              <input 
                matInput 
                formControlName="whatsappBusinessNumber"
                placeholder="1234567892"
                type="tel">
              @if (businessDetailsForm.get('whatsappBusinessNumber')?.invalid && businessDetailsForm.get('whatsappBusinessNumber')?.touched) {
                <mat-error>WhatsApp business number is required</mat-error>
              }
            </mat-form-field>
            <p class="help-text">Orders will be received on this WhatsApp number</p>
          </div>

          <div class="radio-section">
            <label class="section-label">WhatsApp Account Type <span class="required">*</span></label>
            <mat-radio-group formControlName="whatsappAccountType" class="radio-group">
              <mat-radio-button value="personal" class="radio-option">
                Personal WhatsApp
              </mat-radio-button>
              <mat-radio-button value="business" class="radio-option">
                Business WhatsApp
              </mat-radio-button>
              <mat-radio-button value="none" class="radio-option">
                No WhatsApp
              </mat-radio-button>
            </mat-radio-group>
            @if (businessDetailsForm.get('whatsappAccountType')?.invalid && businessDetailsForm.get('whatsappAccountType')?.touched) {
              <div class="error-message">Please select a WhatsApp account type</div>
            }
          </div>

          <div class="form-actions">
            <button 
              type="button" 
              mat-stroked-button 
              (click)="onBack()"
              [disabled]="!canGoPrevious">
              Back
            </button>
            <button 
              type="submit" 
              mat-raised-button 
              color="primary"
              [disabled]="!canGoNext">
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .onboarding-step {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
    }

    .step-content {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    }

    .header-section {
      margin-bottom: 2rem;
    }

    h2 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      color: #1f2937;
    }

    .subtitle {
      font-size: 1.125rem;
      color: #6b7280;
      margin: 0 0 2rem 0;
    }

    .full-width {
      width: 100%;
      margin-bottom: 1.5rem;
    }

    .required {
      color: #ef4444;
    }

    .whatsapp-section {
      margin-bottom: 1.5rem;
    }

    .help-text {
      margin: 0.5rem 0 0 0;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .prefix {
      color: #6b7280;
      font-weight: 500;
      margin-right: 0.5rem;
      background: #f9fafb;
      padding: 0.5rem;
      border-radius: 4px;
      border-right: 1px solid #e5e7eb;
    }

    .radio-section {
      margin-bottom: 2rem;
    }

    .section-label {
      display: block;
      font-weight: 500;
      color: #374151;
      margin-bottom: 1rem;
      font-size: 1rem;
    }

    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .radio-option {
      margin-bottom: 0.5rem;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
    }

    /* Material customization */
    ::ng-deep .mat-mdc-form-field-outline {
      border-radius: 12px;
    }

    ::ng-deep .mat-mdc-text-field-wrapper {
      border-radius: 12px;
    }

    ::ng-deep .mat-mdc-form-field-prefix {
      padding-right: 0;
    }

    ::ng-deep .mat-mdc-radio-button {
      margin-bottom: 0.5rem;
    }

    ::ng-deep .mat-mdc-radio-button .mdc-radio {
      padding: 8px;
    }

    ::ng-deep .mat-mdc-radio-button .mdc-form-field {
      align-items: center;
    }
  `]
})
export class OnboardingBusinessDetailsComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private onboardingService = inject(OnboardingStoreService);

  businessDetailsForm: FormGroup;

  constructor() {
    this.businessDetailsForm = this.fb.group({
      legalBusinessName: ['', [Validators.required]],
      gstNumber: [''],
      ownerName: ['', [Validators.required]],
      whatsappBusinessNumber: ['', [Validators.required]],
      whatsappAccountType: ['', [Validators.required]]
    });

    // Load existing data
    const existingData = this.onboardingService.onboardingData();
    if (existingData.legalBusinessName || existingData.ownerName || existingData.whatsappBusinessNumber) {
      this.businessDetailsForm.patchValue({
        legalBusinessName: existingData.legalBusinessName || '',
        gstNumber: existingData.gstNumber || '',
        ownerName: existingData.ownerName || '',
        whatsappBusinessNumber: existingData.whatsappBusinessNumber || '',
        whatsappAccountType: existingData.whatsappAccountType || ''
      });
    }

    // Save form changes automatically
    this.businessDetailsForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.onboardingService.updateData({
          legalBusinessName: value.legalBusinessName,
          gstNumber: value.gstNumber,
          ownerName: value.ownerName,
          whatsappBusinessNumber: value.whatsappBusinessNumber,
          whatsappAccountType: value.whatsappAccountType
        });
      });
  }

  get canGoPrevious(): boolean {
    return this.onboardingService.canGoPrevious();
  }

  get canGoNext(): boolean {
    return this.businessDetailsForm.valid && this.onboardingService.canGoNext();
  }

  onBack(): void {
    this.onboardingService.goToPreviousStep();
    const currentStep = this.onboardingService.currentStep();
    if (currentStep) {
      this.router.navigate(['/merchant/onboarding', currentStep.key]);
    }
  }

  onNext(): void {
    if (this.businessDetailsForm.valid) {
      this.onboardingService.goToNextStep();
      const currentStep = this.onboardingService.currentStep();
      if (currentStep) {
        this.router.navigate(['/merchant/onboarding', currentStep.key]);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}