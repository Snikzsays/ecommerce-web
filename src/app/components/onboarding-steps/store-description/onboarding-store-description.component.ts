import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OnboardingStoreService } from '../../../services/onboarding-store.service';

@Component({
  selector: 'app-onboarding-store-description',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  template: `
    <div class="onboarding-step">
      <div class="step-content">
        <form [formGroup]="storeDescriptionForm" (ngSubmit)="onNext()">
          
          <mat-form-field class="full-width">
            <mat-label>Store Description</mat-label>
            <textarea 
              matInput 
              formControlName="storeDescription"
              placeholder="Describe what makes your store unique..."
              rows="4">
            </textarea>
            @if (storeDescriptionForm.get('storeDescription')?.invalid && storeDescriptionForm.get('storeDescription')?.touched) {
              <mat-error>Store description must be at least 10 characters</mat-error>
            }
          </mat-form-field>

          <mat-form-field class="full-width">
            <mat-label>Store Tagline (Optional)</mat-label>
            <input 
              matInput 
              formControlName="storeTagline"
              placeholder="e.g., Quality products at affordable prices">
            @if (storeDescriptionForm.get('storeTagline')?.invalid && storeDescriptionForm.get('storeTagline')?.touched) {
              <mat-error>Tagline cannot exceed 100 characters</mat-error>
            }
          </mat-form-field>

          <div class="examples">
            <p class="examples-label">Examples:</p>
            <ul>
              <li>"We specialize in handcrafted jewelry made from sustainable materials."</li>
              <li>"Your one-stop shop for premium electronics and gadgets."</li>
              <li>"Fresh, organic produce delivered directly from local farms."</li>
            </ul>
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

    .examples {
      margin: 1.5rem 0;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 3px solid #6366f1;
    }

    .examples-label {
      font-weight: 500;
      margin: 0 0 0.5rem 0;
      color: #4f46e5;
    }

    .examples ul {
      margin: 0;
      padding-left: 1rem;
    }

    .examples li {
      margin-bottom: 0.25rem;
      color: #6b7280;
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
    }

    textarea {
      resize: vertical;
      min-height: 100px;
    }
  `]
})
export class OnboardingStoreDescriptionComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private onboardingService = inject(OnboardingStoreService);

  storeDescriptionForm: FormGroup;

  constructor() {
    this.storeDescriptionForm = this.fb.group({
      storeDescription: ['', [Validators.required, Validators.minLength(10)]],
      storeTagline: ['', [Validators.maxLength(100)]] // Optional field - no required validator
    });

    // Load existing data
    const existingData = this.onboardingService.onboardingData();
    if (existingData.storeDescription) {
      this.storeDescriptionForm.patchValue({
        storeDescription: existingData.storeDescription,
        storeTagline: existingData.storeTagline || ''
      });
    }

    // Save form changes automatically
    this.storeDescriptionForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.onboardingService.updateData({
          storeDescription: value.storeDescription,
          storeTagline: value.storeTagline
        });
      });
  }

  get canGoPrevious(): boolean {
    return this.onboardingService.canGoPrevious();
  }

  get canGoNext(): boolean {
    return this.storeDescriptionForm.valid && this.onboardingService.canGoNext();
  }

  onBack(): void {
    this.onboardingService.goToPreviousStep();
    const currentStep = this.onboardingService.currentStep();
    if (currentStep) {
      this.router.navigate(['/merchant/onboarding', currentStep.key]);
    }
  }

  onNext(): void {
    if (this.storeDescriptionForm.valid) {
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