import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OnboardingStoreService } from '../../../services/onboarding-store.service';

@Component({
  selector: 'app-onboarding-store-location',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <div class="onboarding-step">
      <div class="step-content">
        <form [formGroup]="locationForm" (ngSubmit)="onNext()">
          
          <mat-form-field class="full-width">
            <mat-label>Store Address</mat-label>
            <textarea 
              matInput 
              formControlName="address"
              placeholder="Enter complete store address"
              rows="3">
            </textarea>
            <mat-icon matSuffix>location_on</mat-icon>
            @if (locationForm.get('address')?.invalid && locationForm.get('address')?.touched) {
              <mat-error>Store address is required</mat-error>
            }
          </mat-form-field>

          <div class="form-row">
            <mat-form-field class="half-width">
              <mat-label>City</mat-label>
              <input 
                matInput 
                formControlName="city"
                placeholder="Enter city">
              @if (locationForm.get('city')?.invalid && locationForm.get('city')?.touched) {
                <mat-error>City is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field class="half-width">
              <mat-label>State</mat-label>
              <mat-select formControlName="state">
                @for (state of indianStates; track state.value) {
                  <mat-option [value]="state.value">{{ state.name }}</mat-option>
                }
              </mat-select>
              @if (locationForm.get('state')?.invalid && locationForm.get('state')?.touched) {
                <mat-error>State is required</mat-error>
              }
            </mat-form-field>
          </div>

          <mat-form-field class="half-width">
            <mat-label>Pincode</mat-label>
            <input 
              matInput 
              formControlName="pincode"
              placeholder="Enter 6-digit pincode"
              maxlength="6">
            @if (locationForm.get('pincode')?.invalid && locationForm.get('pincode')?.touched) {
              <mat-error>
                @if (locationForm.get('pincode')?.errors?.['required']) {
                  Pincode is required
                }
                @if (locationForm.get('pincode')?.errors?.['pattern']) {
                  Pincode must be 6 digits
                }
              </mat-error>
            }
          </mat-form-field>

          <div class="location-info">
            <div class="info-card">
              <mat-icon>info</mat-icon>
              <div>
                <h4>Why we need your store location</h4>
                <ul>
                  <li>Show store location to nearby customers</li>
                  <li>Calculate delivery charges and areas</li>
                  <li>Enable "directions to store" feature</li>
                  <li>Local SEO and search visibility</li>
                </ul>
              </div>
            </div>
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

    .full-width {
      width: 100%;
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .half-width {
      flex: 1;
    }

    .location-info {
      margin: 1.5rem 0;
    }

    .info-card {
      display: flex;
      gap: 0.75rem;
      padding: 1rem;
      background: #f0f9ff;
      border-radius: 8px;
      border-left: 3px solid #0ea5e9;
    }

    .info-card mat-icon {
      color: #0369a1;
      margin-top: 0.25rem;
    }

    .info-card h4 {
      margin: 0 0 0.5rem 0;
      color: #0369a1;
    }

    .info-card ul {
      margin: 0;
      padding-left: 1rem;
    }

    .info-card li {
      margin-bottom: 0.25rem;
      color: #475569;
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
    }

    textarea {
      resize: vertical;
      min-height: 80px;
    }
  `]
})
export class OnboardingStoreLocationComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private onboardingService = inject(OnboardingStoreService);

  locationForm: FormGroup;

  indianStates = [
    { value: 'andhra-pradesh', name: 'Andhra Pradesh' },
    { value: 'arunachal-pradesh', name: 'Arunachal Pradesh' },
    { value: 'assam', name: 'Assam' },
    { value: 'bihar', name: 'Bihar' },
    { value: 'chhattisgarh', name: 'Chhattisgarh' },
    { value: 'goa', name: 'Goa' },
    { value: 'gujarat', name: 'Gujarat' },
    { value: 'haryana', name: 'Haryana' },
    { value: 'himachal-pradesh', name: 'Himachal Pradesh' },
    { value: 'jharkhand', name: 'Jharkhand' },
    { value: 'karnataka', name: 'Karnataka' },
    { value: 'kerala', name: 'Kerala' },
    { value: 'madhya-pradesh', name: 'Madhya Pradesh' },
    { value: 'maharashtra', name: 'Maharashtra' },
    { value: 'manipur', name: 'Manipur' },
    { value: 'meghalaya', name: 'Meghalaya' },
    { value: 'mizoram', name: 'Mizoram' },
    { value: 'nagaland', name: 'Nagaland' },
    { value: 'odisha', name: 'Odisha' },
    { value: 'punjab', name: 'Punjab' },
    { value: 'rajasthan', name: 'Rajasthan' },
    { value: 'sikkim', name: 'Sikkim' },
    { value: 'tamil-nadu', name: 'Tamil Nadu' },
    { value: 'telangana', name: 'Telangana' },
    { value: 'tripura', name: 'Tripura' },
    { value: 'uttar-pradesh', name: 'Uttar Pradesh' },
    { value: 'uttarakhand', name: 'Uttarakhand' },
    { value: 'west-bengal', name: 'West Bengal' },
    { value: 'delhi', name: 'Delhi' },
    { value: 'chandigarh', name: 'Chandigarh' },
    { value: 'puducherry', name: 'Puducherry' }
  ];

  constructor() {
    this.locationForm = this.fb.group({
      address: ['', [Validators.required, Validators.minLength(10)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      state: ['', [Validators.required]],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });

    // Load existing data
    const existingData = this.onboardingService.onboardingData();
    if (existingData.address || existingData.city || existingData.state || existingData.pincode) {
      this.locationForm.patchValue({
        address: existingData.address || '',
        city: existingData.city || '',
        state: existingData.state || '',
        pincode: existingData.pincode || ''
      });
    }

    // Save form changes automatically
    this.locationForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.onboardingService.updateData({
          address: value.address,
          city: value.city,
          state: value.state,
          pincode: value.pincode
        });
      });
  }

  get canGoPrevious(): boolean {
    return this.onboardingService.canGoPrevious();
  }

  get canGoNext(): boolean {
    return this.locationForm.valid && this.onboardingService.canGoNext();
  }

  onBack(): void {
    this.onboardingService.goToPreviousStep();
    const currentStep = this.onboardingService.currentStep();
    if (currentStep) {
      this.router.navigate(['/merchant/onboarding', currentStep.key]);
    }
  }

  onNext(): void {
    if (this.locationForm.valid) {
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