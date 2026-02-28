import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

import { OnboardingStoreService } from '../../../services/onboarding-store.service';

@Component({
  selector: 'app-onboarding-store-name',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],
  template: `
    <div class="store-name-step">
      <form [formGroup]="storeNameForm" class="step-form" (ngSubmit)="onNext()">
        <!-- Store Name Input -->
        <div class="form-section">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Store Name</mat-label>
            <input 
              matInput 
              formControlName="storeName"
              placeholder="e.g., VU's Brew House, The Coffee Corner..."
              maxlength="50"
              autocomplete="off">
            <mat-icon matSuffix>store</mat-icon>
            <mat-hint>Choose a memorable name for your store (2-50 characters)</mat-hint>
            <mat-error *ngIf="storeNameForm.get('storeName')?.hasError('required')">
              Store name is required
            </mat-error>
            <mat-error *ngIf="storeNameForm.get('storeName')?.hasError('minlength')">
              Store name must be at least 2 characters long
            </mat-error>
            <mat-error *ngIf="storeNameForm.get('storeName')?.hasError('maxlength')">
              Store name cannot exceed 50 characters
            </mat-error>
            <mat-error *ngIf="storeNameForm.get('storeName')?.hasError('pattern')">
              Store name can only contain letters, numbers, spaces, and basic punctuation
            </mat-error>
          </mat-form-field>
        </div>

        <!-- Help Section -->
        <div class="help-section">
          <div class="help-card">
            <h3 class="help-title">
              <mat-icon>tips_and_updates</mat-icon>
              Tips for choosing a great store name
            </h3>
            <ul class="tips-list">
              <li>Keep it simple and easy to remember</li>
              <li>Make it relevant to your products or industry</li>
              <li>Avoid special characters and numbers if possible</li>
              <li>Check that the name sounds good when spoken aloud</li>
            </ul>
          </div>
        </div>

        <!-- Examples Section -->
        <div class="examples-section">
          <h4 class="examples-title">Need inspiration? Try these examples:</h4>
          <div class="examples-grid">
            @for (example of storeNameExamples; track example) {
              <button 
                type="button"
                mat-stroked-button
                class="example-button"
                (click)="useExample(example)">
                {{ example }}
              </button>
            }
          </div>
        </div>

        <!-- Form Actions -->
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
    </div>>
  `,
  styles: [`
    .store-name-step {
      padding: 0;
    }

    .step-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-section {
      margin-bottom: 0.5rem;
    }

    .full-width {
      width: 100%;
    }

    .full-width ::ng-deep .mat-mdc-form-field {
      width: 100%;
    }

    .full-width ::ng-deep .mat-mdc-text-field-wrapper {
      border-radius: 12px;
    }

    .full-width ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      margin-top: 0.5rem;
    }

    .url-preview-section {
      margin: 1rem 0;
    }

    .preview-card {
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.3s ease;
    }

    .preview-card:hover {
      border-color: #cbd5e1;
      background: #f1f5f9;
    }

    .preview-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .preview-icon {
      color: #6366f1;
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .preview-title {
      font-weight: 600;
      color: #374151;
    }

    .url-display {
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      padding: 1rem;
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 1.125rem;
      margin-bottom: 0.75rem;
    }

    .base-url {
      color: #6b7280;
    }

    .store-slug {
      color: #1f2937;
      font-weight: 600;
      background: #fef3c7;
      padding: 0.125rem 0.25rem;
      border-radius: 4px;
    }

    .store-slug.valid {
      background: #dcfce7;
      color: #166534;
    }

    .help-section {
      margin: 1rem 0;
    }

    .help-card {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border: 1px solid #bfdbfe;
      border-radius: 12px;
      padding: 1.5rem;
    }

    .help-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e40af;
      margin: 0 0 1rem 0;
    }

    .help-title mat-icon {
      color: #3b82f6;
    }

    .tips-list {
      margin: 0;
      padding-left: 1.25rem;
      color: #1e40af;
    }

    .tips-list li {
      margin-bottom: 0.5rem;
      line-height: 1.4;
    }

    .examples-section {
      margin-top: 1.5rem;
    }

    .examples-title {
      font-size: 1rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 1rem 0;
    }

    .examples-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 0.75rem;
    }

    .example-button {
      border-radius: 8px;
      font-size: 0.875rem;
      padding: 0.5rem 1rem;
      transition: all 0.3s ease;
      border-color: #d1d5db;
      color: #6b7280;
    }

    .example-button:hover {
      border-color: #f59e0b;
      color: #f59e0b;
      background: #fef3c7;
      transform: translateY(-1px);
    }

    /* Responsive Design */
    @media (max-width: 640px) {
      .examples-grid {
        grid-template-columns: 1fr;
      }

      .help-card {
        padding: 1rem;
      }
    }
  `]
})
export class OnboardingStoreNameComponent implements OnInit, OnDestroy {
  storeNameForm: FormGroup;
  
  storeNameExamples = [
    "The Coffee Corner",
    "Brew & Beans",
    "Tea Time Express",
    "Morning Blend Cafe",
    "Spice Garden Store",
    "Fresh Market Hub"
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private onboardingService: OnboardingStoreService
  ) {
    this.storeNameForm = this.fb.group({
      storeName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9\s\-'&.!,]+$/)
      ]]
    });
  }

  ngOnInit(): void {
    // Load existing data if any
    const existingData = this.onboardingService.onboardingData();
    if (existingData.storeName) {
      this.storeNameForm.patchValue({
        storeName: existingData.storeName
      });
    }

    // Watch for store name changes
    this.storeNameForm.get('storeName')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(storeName => {
        this.handleStoreNameChange(storeName);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleStoreNameChange(storeName: string): void {
    const trimmedName = storeName?.trim() || '';
    
    // Update service data
    this.onboardingService.updateData({
      storeName: trimmedName
    });
  }

  useExample(example: string): void {
    this.storeNameForm.patchValue({ storeName: example });
    this.storeNameForm.get('storeName')?.markAsTouched();
  }

  get canGoPrevious(): boolean {
    return this.onboardingService.canGoPrevious();
  }

  get canGoNext(): boolean {
    return this.storeNameForm.valid && this.onboardingService.canGoNext();
  }

  onBack(): void {
    this.onboardingService.goToPreviousStep();
    const currentStep = this.onboardingService.currentStep();
    if (currentStep) {
      this.router.navigate(['/merchant/onboarding', currentStep.key]);
    }
  }

  onNext(): void {
    if (this.storeNameForm.valid) {
      this.onboardingService.goToNextStep();
      const currentStep = this.onboardingService.currentStep();
      if (currentStep) {
        this.router.navigate(['/merchant/onboarding', currentStep.key]);
      }
    }
  }
}