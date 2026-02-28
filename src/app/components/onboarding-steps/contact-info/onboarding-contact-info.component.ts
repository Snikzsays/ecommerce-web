import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OnboardingStoreService } from '../../../services/onboarding-store.service';

@Component({
  selector: 'app-onboarding-contact-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <div class="onboarding-step">
      <div class="step-content">
        <form [formGroup]="contactForm" (ngSubmit)="onNext()">
          
          <mat-form-field class="full-width">
            <mat-label>Phone Number</mat-label>
            <input 
              matInput 
              formControlName="phoneNumber"
              placeholder="Enter your phone number"
              type="tel">
            <mat-icon matSuffix>phone</mat-icon>
            @if (contactForm.get('phoneNumber')?.invalid && contactForm.get('phoneNumber')?.touched) {
              <mat-error>Phone number is required</mat-error>
            }
          </mat-form-field>

          <mat-form-field class="full-width">
            <mat-label>Email Address</mat-label>
            <input 
              matInput 
              formControlName="email"
              placeholder="your-email@example.com"
              type="email">
            <mat-icon matSuffix>email</mat-icon>
            @if (contactForm.get('email')?.invalid && contactForm.get('email')?.touched) {
              <mat-error>
                @if (contactForm.get('email')?.errors?.['required']) {
                  Email address is required
                }
                @if (contactForm.get('email')?.errors?.['email']) {
                  Please enter a valid email address
                }
              </mat-error>
            }
          </mat-form-field>

          <mat-form-field class="full-width">
            <mat-label>WhatsApp Number (Optional)</mat-label>
            <input 
              matInput 
              formControlName="whatsappNumber"
              placeholder="Enter WhatsApp number"
              type="tel">
            <mat-icon matSuffix>chat</mat-icon>
            <mat-hint>Can be same as phone number</mat-hint>
          </mat-form-field>

          <div class="features-info">
            <h4>How customers will use this information:</h4>
            <div class="feature-item">
              <mat-icon>phone</mat-icon>
              <div>
                <strong>Phone</strong>
                <p>For order confirmations and delivery coordination</p>
              </div>
            </div>
            <div class="feature-item">
              <mat-icon>email</mat-icon>
              <div>
                <strong>Email</strong>
                <p>Order receipts, updates, and promotional offers</p>
              </div>
            </div>
            <div class="feature-item">
              <mat-icon>chat</mat-icon>
              <div>
                <strong>WhatsApp</strong>
                <p>Quick customer support and order status updates</p>
              </div>
            </div>
          </div>

          <div class="privacy-note">
            <mat-icon>security</mat-icon>
            <p>Your contact information is secure and will only be shared with customers for order-related communications.</p>
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

    .features-info {
      margin: 1.5rem 0;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .features-info h4 {
      margin: 0 0 1rem 0;
      color: #4f46e5;
    }

    .feature-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 1rem;
      gap: 0.75rem;
    }

    .feature-item mat-icon {
      color: #6366f1;
      margin-top: 0.25rem;
    }

    .feature-item div {
      flex: 1;
    }

    .feature-item strong {
      display: block;
      margin-bottom: 0.25rem;
      color: #374151;
    }

    .feature-item p {
      margin: 0;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .privacy-note {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 1.5rem 0;
      padding: 0.75rem;
      background: #ecfdf5;
      border-radius: 6px;
      border: 1px solid #d1fae5;
    }

    .privacy-note mat-icon {
      color: #059669;
    }

    .privacy-note p {
      margin: 0;
      color: #064e3b;
      font-size: 0.875rem;
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
    }
  `]
})
export class OnboardingContactInfoComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private onboardingService = inject(OnboardingStoreService);

  contactForm: FormGroup;

  constructor() {
    this.contactForm = this.fb.group({
      phoneNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      whatsappNumber: ['']
    });

    // Load existing data
    const existingData = this.onboardingService.onboardingData();
    if (existingData.phoneNumber || existingData.email || existingData.whatsappNumber) {
      this.contactForm.patchValue({
        phoneNumber: existingData.phoneNumber || '',
        email: existingData.email || '',
        whatsappNumber: existingData.whatsappNumber || ''
      });
    }

    // Save form changes automatically
    this.contactForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.onboardingService.updateData({
          phoneNumber: value.phoneNumber,
          email: value.email,
          whatsappNumber: value.whatsappNumber
        });
      });
  }

  get canGoPrevious(): boolean {
    return this.onboardingService.canGoPrevious();
  }

  get canGoNext(): boolean {
    return this.contactForm.valid && this.onboardingService.canGoNext();
  }

  onBack(): void {
    this.onboardingService.goToPreviousStep();
    const currentStep = this.onboardingService.currentStep();
    if (currentStep) {
      this.router.navigate(['/merchant/onboarding', currentStep.key]);
    }
  }

  onNext(): void {
    if (this.contactForm.valid) {
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