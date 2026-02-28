import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  selector: 'app-onboarding-online-presence',
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
        <div class="header-section">
          <div class="icon-container">
            <mat-icon class="header-icon">public</mat-icon>
          </div>
          <h2>Your online presence</h2>
          <p class="subtitle">Connect your social media and website (optional)</p>
        </div>

        <form [formGroup]="onlinePresenceForm" (ngSubmit)="onNext()">
          
          <div class="form-field-container">
            <div class="field-header">
              <mat-icon class="platform-icon instagram">camera_alt</mat-icon>
              <span class="field-label">Instagram Handle</span>
            </div>
            <mat-form-field class="full-width" appearance="outline">
              <span matPrefix class="prefix">@</span>
              <input 
                matInput 
                formControlName="instagramHandle"
                placeholder="yourstorename">
            </mat-form-field>
          </div>

          <div class="form-field-container">
            <div class="field-header">
              <mat-icon class="platform-icon facebook">facebook</mat-icon>
              <span class="field-label">Facebook Page</span>
            </div>
            <mat-form-field class="full-width" appearance="outline">
              <span matPrefix class="prefix">facebook.com/</span>
              <input 
                matInput 
                formControlName="facebookPage"
                placeholder="yourstorename">
            </mat-form-field>
          </div>

          <div class="form-field-container">
            <div class="field-header">
              <mat-icon class="platform-icon website">language</mat-icon>
              <span class="field-label">Website / WebApp</span>
            </div>
            <mat-form-field class="full-width" appearance="outline">
              <span matPrefix class="prefix">www.</span>
              <input 
                matInput 
                formControlName="website"
                placeholder="yourstore.com">
            </mat-form-field>
          </div>

          <div class="tip-section">
            <mat-icon class="tip-icon">lightbulb</mat-icon>
            <span class="tip-text">Tip: Adding social links builds trust with customers</span>
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
      text-align: center;
      margin-bottom: 2rem;
    }

    .icon-container {
      width: 80px;
      height: 80px;
      background: #f3e8ff;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }

    .header-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #9333ea;
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
      margin: 0;
    }

    .form-field-container {
      margin-bottom: 1.5rem;
    }

    .field-header {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
      gap: 0.5rem;
    }

    .platform-icon {
      width: 24px;
      height: 24px;
      font-size: 24px;
    }

    .platform-icon.instagram {
      color: #e1306c;
    }

    .platform-icon.facebook {
      color: #1877f2;
    }

    .platform-icon.website {
      color: #10b981;
    }

    .field-label {
      font-weight: 600;
      font-size: 1rem;
      color: #374151;
    }

    .full-width {
      width: 100%;
    }

    .prefix {
      color: #9ca3af;
      font-weight: 500;
      margin-right: 0.25rem;
    }

    .tip-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #fef3c7;
      padding: 1rem;
      border-radius: 8px;
      border-left: 4px solid #f59e0b;
      margin: 1.5rem 0;
    }

    .tip-icon {
      color: #d97706;
      width: 20px;
      height: 20px;
      font-size: 20px;
    }

    .tip-text {
      color: #92400e;
      font-weight: 500;
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
    }

    /* Material input customization */
    ::ng-deep .mat-mdc-form-field-outline {
      border-radius: 12px;
    }

    ::ng-deep .mat-mdc-text-field-wrapper {
      border-radius: 12px;
    }

    ::ng-deep .mat-mdc-form-field-prefix {
      padding-right: 0;
    }
  `]
})
export class OnboardingOnlinePresenceComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private onboardingService = inject(OnboardingStoreService);

  onlinePresenceForm: FormGroup;

  constructor() {
    this.onlinePresenceForm = this.fb.group({
      instagramHandle: [''],
      facebookPage: [''],
      website: ['']
    });

    // Load existing data
    const existingData = this.onboardingService.onboardingData();
    if (existingData.instagramHandle || existingData.facebookPage || existingData.website) {
      this.onlinePresenceForm.patchValue({
        instagramHandle: existingData.instagramHandle || '',
        facebookPage: existingData.facebookPage || '',
        website: existingData.website || ''
      });
    }

    // Save form changes automatically
    this.onlinePresenceForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.onboardingService.updateData({
          instagramHandle: value.instagramHandle,
          facebookPage: value.facebookPage,
          website: value.website
        });
      });
  }

  get canGoPrevious(): boolean {
    return this.onboardingService.canGoPrevious();
  }

  get canGoNext(): boolean {
    // Always can go next since all fields are optional
    return this.onboardingService.canGoNext();
  }

  onBack(): void {
    this.onboardingService.goToPreviousStep();
    const currentStep = this.onboardingService.currentStep();
    if (currentStep) {
      this.router.navigate(['/merchant/onboarding', currentStep.key]);
    }
  }

  onNext(): void {
    this.onboardingService.goToNextStep();
    const currentStep = this.onboardingService.currentStep();
    if (currentStep) {
      this.router.navigate(['/merchant/onboarding', currentStep.key]);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}