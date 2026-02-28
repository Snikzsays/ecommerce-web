import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OnboardingStoreService } from '../../../services/onboarding-store.service';

interface DayHours {
  open: string;
  close: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-onboarding-operating-hours',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule
  ],
  template: `
    <div class="onboarding-step">
      <div class="step-content">
        <form [formGroup]="hoursForm" (ngSubmit)="onNext()">
          
          <div class="hours-section">
            <h3>Store Operating Hours</h3>
            <p class="subtitle">Set your store's operating hours for each day of the week</p>

            @for (day of weekDays; track day.key) {
              <div class="day-row">
                <div class="day-header">
                  <mat-checkbox 
                    [formControlName]="day.key + '_isOpen'"
                    (change)="onDayToggle(day.key, $event.checked)">
                    {{ day.label }}
                  </mat-checkbox>
                </div>

                @if (getDayControl(day.key, 'isOpen')?.value) {
                  <div class="time-inputs">
                    <mat-form-field class="time-field">
                      <mat-label>Open</mat-label>
                      <input 
                        matInput 
                        type="time"
                        [formControlName]="day.key + '_open'">
                    </mat-form-field>
                    
                    <span class="time-separator">to</span>
                    
                    <mat-form-field class="time-field">
                      <mat-label>Close</mat-label>
                      <input 
                        matInput 
                        type="time"
                        [formControlName]="day.key + '_close'">
                    </mat-form-field>
                  </div>
                } @else {
                  <div class="closed-indicator">
                    <span>Closed</span>
                  </div>
                }
              </div>
            }
          </div>

          <div class="quick-actions">
            <h4>Quick Actions</h4>
            <div class="action-buttons">
              <button 
                type="button" 
                mat-stroked-button 
                (click)="setWeekdayHours()">
                Set Weekday Hours (Mon-Fri)
              </button>
              <button 
                type="button" 
                mat-stroked-button 
                (click)="setSameHours()">
                Same Hours Every Day
              </button>
            </div>
          </div>

          <div class="info-card">
            <mat-icon>schedule</mat-icon>
            <div>
              <h4>How operating hours help your business</h4>
              <ul>
                <li>Customers know when to visit your store</li>
                <li>Online orders can be scheduled during business hours</li>
                <li>Automatic customer communication about store status</li>
                <li>Better inventory and staff planning</li>
              </ul>
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

    .hours-section {
      margin-bottom: 2rem;
    }

    .hours-section h3 {
      margin: 0 0 0.5rem 0;
      color: #374151;
    }

    .subtitle {
      margin: 0 0 1.5rem 0;
      color: #6b7280;
    }

    .day-row {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      margin-bottom: 0.5rem;
      background: #f9fafb;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }

    .day-header {
      min-width: 120px;
    }

    .time-inputs {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
    }

    .time-field {
      width: 100px;
    }

    .time-separator {
      color: #6b7280;
      font-weight: 500;
    }

    .closed-indicator {
      flex: 1;
      text-align: left;
      color: #9ca3af;
      font-style: italic;
    }

    .quick-actions {
      margin: 2rem 0;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .quick-actions h4 {
      margin: 0 0 1rem 0;
      color: #374151;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .action-buttons button {
      font-size: 0.875rem;
    }

    .info-card {
      display: flex;
      gap: 0.75rem;
      margin: 1.5rem 0;
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
  `]
})
export class OnboardingOperatingHoursComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private onboardingService = inject(OnboardingStoreService);

  hoursForm: FormGroup;

  weekDays = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  constructor() {
    // Create form controls for each day
    const formControls: any = {};
    this.weekDays.forEach(day => {
      formControls[`${day.key}_isOpen`] = [true];
      formControls[`${day.key}_open`] = ['09:00', Validators.required];
      formControls[`${day.key}_close`] = ['18:00', Validators.required];
    });

    this.hoursForm = this.fb.group(formControls);

    // Load existing data
    const existingData = this.onboardingService.onboardingData();
    if (existingData.operatingHours) {
      const hours = existingData.operatingHours;
      this.weekDays.forEach(day => {
        const dayData = hours[day.key];
        if (dayData) {
          this.hoursForm.patchValue({
            [`${day.key}_isOpen`]: dayData.isOpen,
            [`${day.key}_open`]: dayData.open,
            [`${day.key}_close`]: dayData.close
          });
        }
      });
    } else {
      // Set Sunday as closed by default
      this.hoursForm.patchValue({
        sunday_isOpen: false,
        sunday_open: '10:00',
        sunday_close: '17:00'
      });
    }

    // Save form changes automatically
    this.hoursForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.saveOperatingHours();
      });
  }

  getDayControl(day: string, field: 'isOpen' | 'open' | 'close') {
    return this.hoursForm.get(`${day}_${field}`);
  }

  onDayToggle(day: string, isOpen: boolean): void {
    if (!isOpen) {
      // Clear validators for closed days
      this.getDayControl(day, 'open')?.clearValidators();
      this.getDayControl(day, 'close')?.clearValidators();
    } else {
      // Add validators for open days
      this.getDayControl(day, 'open')?.setValidators([Validators.required]);
      this.getDayControl(day, 'close')?.setValidators([Validators.required]);
    }
    this.getDayControl(day, 'open')?.updateValueAndValidity();
    this.getDayControl(day, 'close')?.updateValueAndValidity();
  }

  setWeekdayHours(): void {
    const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    weekdays.forEach(day => {
      this.hoursForm.patchValue({
        [`${day}_isOpen`]: true,
        [`${day}_open`]: '09:00',
        [`${day}_close`]: '18:00'
      });
    });
  }

  setSameHours(): void {
    this.weekDays.forEach(day => {
      this.hoursForm.patchValue({
        [`${day.key}_isOpen`]: true,
        [`${day.key}_open`]: '09:00',
        [`${day.key}_close`]: '18:00'
      });
    });
  }

  private saveOperatingHours(): void {
    const operatingHours: { [key: string]: DayHours } = {};
    
    this.weekDays.forEach(day => {
      operatingHours[day.key] = {
        isOpen: this.getDayControl(day.key, 'isOpen')?.value || false,
        open: this.getDayControl(day.key, 'open')?.value || '09:00',
        close: this.getDayControl(day.key, 'close')?.value || '18:00'
      };
    });

    this.onboardingService.updateData({ operatingHours });
  }

  get canGoPrevious(): boolean {
    return this.onboardingService.canGoPrevious();
  }

  get canGoNext(): boolean {
    return this.hoursForm.valid && this.onboardingService.canGoNext();
  }

  onBack(): void {
    this.onboardingService.goToPreviousStep();
    const currentStep = this.onboardingService.currentStep();
    if (currentStep) {
      this.router.navigate(['/merchant/onboarding', currentStep.key]);
    }
  }

  onNext(): void {
    if (this.hoursForm.valid) {
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