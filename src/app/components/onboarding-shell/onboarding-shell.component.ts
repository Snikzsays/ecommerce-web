import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';

import { OnboardingStoreService } from '../../services/onboarding-store.service';

@Component({
  selector: 'app-onboarding-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatCardModule
  ],
  template: `
    <div class="onboarding-shell">
      <!-- Header -->
      <div class="onboarding-header">
        <div class="header-content">
          <!-- Logo/Brand -->
          <div class="brand">
            <mat-icon class="brand-icon">local_cafe</mat-icon>
            <span class="brand-text">Vyaro Setup</span>
          </div>
          
          <!-- Progress -->
          <div class="progress-section">
            <div class="progress-text">
              <span class="step-info">Step {{ onboardingService.currentStepIndex() + 1 }} of {{ onboardingService.steps().length }}</span>
              <span class="progress-percent">{{ onboardingService.progress() }}% Complete</span>
            </div>
            <mat-progress-bar 
              [value]="onboardingService.progress()" 
              mode="determinate"
              class="progress-bar">
            </mat-progress-bar>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="onboarding-content">
        <div class="content-container">
          <!-- Step Header -->
          <div class="step-header">
            <h1 class="step-title">{{ onboardingService.currentStep().title }}</h1>
            <p class="step-subtitle">{{ onboardingService.currentStep().subtitle }}</p>
          </div>

          <!-- Step Content -->
          <div class="step-content">
            <router-outlet />
          </div>

          <!-- Navigation Footer (Hidden - steps handle their own navigation) -->
          <div class="navigation-footer" style="display: none;">
            <button 
              mat-button
              [disabled]="!onboardingService.canGoPrevious()"
              (click)="goBack()"
              class="nav-button back-button">
              <mat-icon>arrow_back</mat-icon>
              Back
            </button>

            <div class="nav-spacer"></div>

            <button 
              mat-raised-button
              color="primary"
              [disabled]="!onboardingService.canGoNext()"
              (click)="goNext()"
              class="nav-button continue-button">
              {{ isLastStep() ? 'Complete Setup' : 'Continue' }}
              <mat-icon>{{ isLastStep() ? 'check' : 'arrow_forward' }}</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Step Indicator (Optional) -->
      <div class="step-indicator">
        <div class="steps-list">
          @for (step of onboardingService.steps(); track step.id; let i = $index) {
            <div 
              class="step-dot"
              [class.active]="i === onboardingService.currentStepIndex()"
              [class.completed]="step.completed"
              [class.required]="step.required"
              (click)="goToStep(i)">
              <span class="step-number">{{ i + 1 }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .onboarding-shell {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      display: flex;
      flex-direction: column;
    }

    .onboarding-header {
      background: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border-bottom: 1px solid #e2e8f0;
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 600;
      color: #1f2937;
    }

    .brand-icon {
      width: 2rem;
      height: 2rem;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .brand-text {
      font-size: 1.25rem;
    }

    .progress-section {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-width: 250px;
    }

    .progress-text {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .step-info {
      font-weight: 500;
    }

    .progress-percent {
      color: #059669;
      font-weight: 600;
    }

    .progress-bar {
      height: 6px;
      border-radius: 3px;
    }

    .progress-bar ::ng-deep .mat-mdc-progress-bar-fill::after {
      background: linear-gradient(135deg, #10b981, #059669);
    }

    .onboarding-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.5rem;
    }

    .content-container {
      width: 100%;
      max-width: 600px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .step-header {
      padding: 2.5rem 2rem 1.5rem 2rem;
      text-align: center;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
    }

    .step-title {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      line-height: 1.2;
    }

    .step-subtitle {
      font-size: 1.125rem;
      margin: 0;
      opacity: 0.9;
      line-height: 1.4;
    }

    .step-content {
      padding: 2rem;
      min-height: 300px;
    }

    .navigation-footer {
      padding: 1.5rem 2rem;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
    }

    .nav-spacer {
      flex: 1;
    }

    .nav-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
    }

    .back-button {
      color: #6b7280;
    }

    .back-button:not(:disabled):hover {
      background: #f3f4f6;
      color: #374151;
    }

    .continue-button {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
    }

    .continue-button:not(:disabled):hover {
      background: linear-gradient(135deg, #d97706, #b45309);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
    }

    .step-indicator {
      position: fixed;
      right: 2rem;
      top: 50%;
      transform: translateY(-50%);
      z-index: 50;
    }

    .steps-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .step-dot {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: white;
      border: 2px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .step-dot.active {
      border-color: #f59e0b;
      background: #f59e0b;
      color: white;
      transform: scale(1.1);
    }

    .step-dot.completed {
      border-color: #10b981;
      background: #10b981;
      color: white;
    }

    .step-dot.required.completed .step-number::before {
      content: '✓';
      font-weight: bold;
    }

    .step-number {
      font-size: 0.875rem;
      font-weight: 600;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .step-indicator {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
      }

      .progress-section {
        width: 100%;
        min-width: unset;
      }

      .content-container {
        margin: 0;
        border-radius: 0;
        box-shadow: none;
      }

      .step-header {
        padding: 2rem 1.5rem 1rem 1.5rem;
      }

      .step-title {
        font-size: 1.5rem;
      }

      .step-subtitle {
        font-size: 1rem;
      }

      .step-content {
        padding: 1.5rem;
      }

      .navigation-footer {
        padding: 1rem 1.5rem;
      }

      .nav-button {
        padding: 0.625rem 1.25rem;
      }
    }
  `]
})
export class OnboardingShellComponent implements OnInit {
  
  constructor(
    public onboardingService: OnboardingStoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Sync step with current route
    this.syncStepWithRoute();
  }

  private syncStepWithRoute(): void {
    const currentUrl = this.router.url;
    const stepKey = currentUrl.split('/').pop();
    
    if (stepKey) {
      const stepIndex = this.onboardingService.steps().findIndex(step => step.key === stepKey);
      if (stepIndex !== -1 && stepIndex !== this.onboardingService.currentStepIndex()) {
        this.onboardingService.goToStep(stepIndex);
      }
    }
  }

  goBack(): void {
    if (this.onboardingService.canGoPrevious()) {
      this.onboardingService.goToPreviousStep();
      this.navigateToCurrentStep();
    }
  }

  goNext(): void {
    if (this.onboardingService.canGoNext()) {
      if (this.isLastStep()) {
        this.completeOnboarding();
      } else {
        this.onboardingService.goToNextStep();
        this.navigateToCurrentStep();
      }
    }
  }

  goToStep(stepIndex: number): void {
    // Only allow going to previous steps or current step
    if (stepIndex <= this.onboardingService.currentStepIndex()) {
      this.onboardingService.goToStep(stepIndex);
      this.navigateToCurrentStep();
    }
  }

  isLastStep(): boolean {
    return this.onboardingService.isLastStep();
  }

  private navigateToCurrentStep(): void {
    const currentStep = this.onboardingService.currentStep();
    if (currentStep) {
      this.router.navigate(['/merchant/onboarding', currentStep.key]);
    }
  }

  private completeOnboarding(): void {
    this.onboardingService.completeOnboarding();
    this.router.navigate(['/merchant/dashboard']);
  }
}