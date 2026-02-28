import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-merchant-onboarding',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],
  template: `
    <div class="onboarding-container">
      <div class="onboarding-content">
        <!-- Welcome Header -->
        <div class="welcome-header">
          <h1 class="welcome-title">Welcome to Vyaro!</h1>
          <h2 class="welcome-subtitle">Let's set up your online store in just a few minutes</h2>
          <p class="welcome-helper">We'll guide you through each step</p>
        </div>

        <!-- Setup Overview Card -->
        <mat-card class="setup-card">
          <mat-card-header>
            <mat-card-title class="card-title">What we'll set up together:</mat-card-title>
          </mat-card-header>
          
          <mat-card-content class="setup-steps">
            <div class="setup-step">
              <div class="step-icon store-info">
                <mat-icon>store</mat-icon>
              </div>
              <div class="step-content">
                <h3>Store Information</h3>
                <p>Name, description, and online presence</p>
              </div>
            </div>

            <div class="setup-step">
              <div class="step-icon business-details">
                <mat-icon>business</mat-icon>
              </div>
              <div class="step-content">
                <h3>Business Details</h3>
                <p>GST, owner info, and contact details</p>
              </div>
            </div>

            <div class="setup-step">
              <div class="step-icon product-catalog">
                <mat-icon>inventory</mat-icon>
              </div>
              <div class="step-content">
                <h3>Product Catalog</h3>
                <p>Upload products via Excel, images, or voice</p>
              </div>
            </div>

            <div class="setup-step">
              <div class="step-icon store-location">
                <mat-icon>location_on</mat-icon>
              </div>
              <div class="step-content">
                <h3>Store Location</h3>
                <p>Address and operating hours</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Action Section -->
        <div class="action-section">
          <button 
            mat-raised-button 
            color="primary" 
            class="get-started-btn"
            routerLink="/merchant/dashboard">
            Let's Get Started
            <mat-icon>arrow_forward</mat-icon>
          </button>
          <p class="time-estimate">Takes about 5–10 minutes</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .onboarding-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .onboarding-content {
      max-width: 600px;
      width: 100%;
      text-align: center;
    }

    .welcome-header {
      margin-bottom: 3rem;
      color: white;
    }

    .welcome-title {
      font-size: 3.5rem;
      font-weight: 800;
      margin: 0 0 1rem 0;
      letter-spacing: -0.02em;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .welcome-subtitle {
      font-size: 1.5rem;
      font-weight: 400;
      margin: 0 0 0.75rem 0;
      opacity: 0.95;
      line-height: 1.4;
    }

    .welcome-helper {
      font-size: 1.125rem;
      margin: 0;
      opacity: 0.8;
    }

    .setup-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.2);
      margin-bottom: 3rem;
      overflow: hidden;
    }

    .card-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      text-align: center;
      margin: 1rem 0;
    }

    .setup-steps {
      padding: 0 1.5rem 1.5rem 1.5rem;
    }

    .setup-step {
      display: flex;
      align-items: flex-start;
      gap: 1.25rem;
      padding: 1.5rem 0;
      border-bottom: 1px solid #f1f5f9;
      text-align: left;
    }

    .setup-step:last-child {
      border-bottom: none;
    }

    .step-icon {
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .step-icon mat-icon {
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
      color: white;
    }

    .store-info {
      background: linear-gradient(135deg, #06b6d4, #0891b2);
    }

    .business-details {
      background: linear-gradient(135deg, #10b981, #059669);
    }

    .product-catalog {
      background: linear-gradient(135deg, #f59e0b, #d97706);
    }

    .store-location {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    }

    .step-content h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
      line-height: 1.3;
    }

    .step-content p {
      font-size: 1rem;
      color: #6b7280;
      margin: 0;
      line-height: 1.5;
    }

    .action-section {
      text-align: center;
    }

    .get-started-btn {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
      border: none;
      padding: 1rem 2.5rem;
      font-size: 1.25rem;
      font-weight: 600;
      border-radius: 16px;
      box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4);
      transition: all 0.3s ease;
      margin-bottom: 1rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .get-started-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(245, 158, 11, 0.5);
      background: linear-gradient(135deg, #d97706, #b45309);
    }

    .get-started-btn mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      transition: transform 0.3s ease;
    }

    .get-started-btn:hover mat-icon {
      transform: translateX(2px);
    }

    .time-estimate {
      color: white;
      font-size: 1rem;
      margin: 0;
      opacity: 0.9;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .onboarding-container {
        padding: 1.5rem;
      }

      .welcome-title {
        font-size: 2.5rem;
      }

      .welcome-subtitle {
        font-size: 1.25rem;
      }

      .setup-card {
        margin-bottom: 2rem;
      }

      .setup-steps {
        padding: 0 1rem 1rem 1rem;
      }

      .setup-step {
        gap: 1rem;
        padding: 1.25rem 0;
      }

      .step-icon {
        width: 3rem;
        height: 3rem;
      }

      .step-icon mat-icon {
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
      }

      .get-started-btn {
        padding: 0.875rem 2rem;
        font-size: 1.125rem;
      }
    }

    @media (max-width: 480px) {
      .welcome-title {
        font-size: 2rem;
      }

      .welcome-subtitle {
        font-size: 1.125rem;
      }

      .setup-step {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 0.75rem;
      }

      .step-content h3 {
        font-size: 1.125rem;
      }

      .step-content p {
        font-size: 0.875rem;
      }
    }
  `]
})
export class MerchantOnboardingComponent {}