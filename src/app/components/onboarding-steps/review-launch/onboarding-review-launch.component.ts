import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OnboardingStoreService, OnboardingData } from '../../../services/onboarding-store.service';

@Component({
  selector: 'app-onboarding-review-launch',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatDividerModule
  ],
  template: `
    <div class="onboarding-step">
      <div class="step-content">
        <div class="header">
          <mat-icon class="success-icon">check_circle</mat-icon>
          <h2>Ready to Launch Your Store!</h2>
          <p>Review your store details and launch when you're ready</p>
        </div>

        <div class="review-sections">
          <!-- Store Information -->
          <mat-card class="review-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>store</mat-icon>
              <mat-card-title>Store Information</mat-card-title>
              <button mat-icon-button (click)="editStep(0)">
                <mat-icon>edit</mat-icon>
              </button>
            </mat-card-header>
            <mat-card-content>
              <div class="detail-row">
                <strong>Name:</strong> {{ storeData.storeName }}
              </div>
              <div class="detail-row">
                <strong>Description:</strong> {{ storeData.storeDescription }}
              </div>
              @if (storeData.storeTagline) {
                <div class="detail-row">
                  <strong>Tagline:</strong> {{ storeData.storeTagline }}
                </div>
              }
            </mat-card-content>
          </mat-card>

          <!-- Online Presence -->
          <mat-card class="review-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>public</mat-icon>
              <mat-card-title>Online Presence</mat-card-title>
              <button mat-icon-button (click)="editStep(2)">
                <mat-icon>edit</mat-icon>
              </button>
            </mat-card-header>
            <mat-card-content>
              @if (storeData.instagramHandle) {
                <div class="detail-row">
                  <strong>Instagram:</strong> @{{ storeData.instagramHandle }}
                </div>
              }
              @if (storeData.facebookPage) {
                <div class="detail-row">
                  <strong>Facebook:</strong> facebook.com/{{ storeData.facebookPage }}
                </div>
              }
              @if (storeData.website) {
                <div class="detail-row">
                  <strong>Website:</strong> www.{{ storeData.website }}
                </div>
              }
              @if (!storeData.instagramHandle && !storeData.facebookPage && !storeData.website) {
                <div class="detail-row">
                  <em>No social media links added</em>
                </div>
              }
            </mat-card-content>
          </mat-card>

          <!-- Business Details -->
          <mat-card class="review-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>business</mat-icon>
              <mat-card-title>Business Details</mat-card-title>
              <button mat-icon-button (click)="editStep(3)">
                <mat-icon>edit</mat-icon>
              </button>
            </mat-card-header>
            <mat-card-content>
              <div class="detail-row">
                <strong>Legal Business Name:</strong> {{ storeData.legalBusinessName }}
              </div>
              @if (storeData.gstNumber) {
                <div class="detail-row">
                  <strong>GST Number:</strong> {{ storeData.gstNumber }}
                </div>
              }
              <div class="detail-row">
                <strong>Owner Name:</strong> {{ storeData.ownerName }}
              </div>
              <div class="detail-row">
                <strong>WhatsApp Business:</strong> +91{{ storeData.whatsappBusinessNumber }}
              </div>
              <div class="detail-row">
                <strong>WhatsApp Type:</strong> {{ formatWhatsAppType(storeData.whatsappAccountType) }}
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Category Selection -->
          <mat-card class="review-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>category</mat-icon>
              <mat-card-title>Product Categories</mat-card-title>
              <button mat-icon-button (click)="editStep(4)">
                <mat-icon>edit</mat-icon>
              </button>
            </mat-card-header>
            <mat-card-content>
              @if (storeData.selectedCategories && storeData.selectedCategories.length > 0) {
                <div class="categories-list">
                  @for (category of formatCategories(storeData.selectedCategories); track category) {
                    <span class="category-chip">{{ category }}</span>
                  }
                </div>
              } @else {
                <div class="detail-row">
                  <em>No categories selected</em>
                </div>
              }
            </mat-card-content>
          </mat-card>

          <!-- Contact Information -->
          <mat-card class="review-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>contact_mail</mat-icon>
              <mat-card-title>Contact Information</mat-card-title>
              <button mat-icon-button (click)="editStep(5)">
                <mat-icon>edit</mat-icon>
              </button>
            </mat-card-header>
            <mat-card-content>
              <div class="detail-row">
                <strong>Phone:</strong> {{ storeData.phoneNumber }}
              </div>
              <div class="detail-row">
                <strong>Email:</strong> {{ storeData.email }}
              </div>
              @if (storeData.whatsappNumber) {
                <div class="detail-row">
                  <strong>WhatsApp:</strong> {{ storeData.whatsappNumber }}
                </div>
              }
            </mat-card-content>
          </mat-card>

          <!-- Store Location -->
          <mat-card class="review-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>location_on</mat-icon>
              <mat-card-title>Store Location</mat-card-title>
              <button mat-icon-button (click)="editStep(6)">
                <mat-icon>edit</mat-icon>
              </button>
            </mat-card-header>
            <mat-card-content>
              <div class="detail-row">
                <strong>Address:</strong> {{ storeData.address }}
              </div>
              <div class="detail-row">
                <strong>City:</strong> {{ storeData.city }}, {{ formatState(storeData.state) }}
              </div>
              <div class="detail-row">
                <strong>Pincode:</strong> {{ storeData.pincode }}
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Operating Hours -->
          <mat-card class="review-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>schedule</mat-icon>
              <mat-card-title>Operating Hours</mat-card-title>
              <button mat-icon-button (click)="editStep(7)">
                <mat-icon>edit</mat-icon>
              </button>
            </mat-card-header>
            <mat-card-content>
              @for (day of getOpenDays(); track day.name) {
                <div class="detail-row">
                  <strong>{{ day.name }}:</strong> {{ day.hours }}
                </div>
              }
            </mat-card-content>
          </mat-card>

          <!-- Product Catalog -->
          <mat-card class="review-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>inventory</mat-icon>
              <mat-card-title>Product Catalog</mat-card-title>
              <button mat-icon-button (click)="editStep(8)">
                <mat-icon>edit</mat-icon>
              </button>
            </mat-card-header>
            <mat-card-content>
              <div class="detail-row">
                <strong>Method:</strong> {{ formatCatalogMethod(storeData.catalogMethod) }}
              </div>
              @if (storeData.products && storeData.products.length > 0) {
                <div class="detail-row">
                  <strong>Products:</strong> {{ storeData.products.length }} item(s)
                </div>
              }
            </mat-card-content>
          </mat-card>

          <!-- Language Preferences -->
          <mat-card class="review-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>translate</mat-icon>
              <mat-card-title>Language Preferences</mat-card-title>
              <button mat-icon-button (click)="editStep(9)">
                <mat-icon>edit</mat-icon>
              </button>
            </mat-card-header>
            <mat-card-content>
              @if (storeData.selectedLanguages && storeData.selectedLanguages.length > 0) {
                <div class="languages-list">
                  @for (language of formatLanguages(storeData.selectedLanguages); track language) {
                    <span class="language-chip">{{ language }}</span>
                  }
                </div>
              } @else {
                <div class="detail-row">
                  <em>No languages selected</em>
                </div>
              }
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Launch Actions -->
        <div class="launch-section">
          <mat-card class="launch-card">
            <mat-card-content>
              <div class="launch-content">
                <div class="launch-info">
                  <h3>🚀 Ready to Launch!</h3>
                  <p>Your store setup is complete. Click "Launch Store" to:</p>
                  <ul>
                    <li>Make your store live and accessible to customers</li>
                    <li>Generate your custom store URL</li>
                    <li>Enable online ordering and payments</li>
                    <li>Start receiving orders immediately</li>
                  </ul>
                </div>
                
                <div class="launch-progress">
                  <h4>Completion Progress</h4>
                  <mat-progress-bar [value]="completionPercentage" mode="determinate"></mat-progress-bar>
                  <p>{{ completionPercentage }}% Complete</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
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
            type="button" 
            mat-raised-button 
            color="primary"
            (click)="launchStore()"
            [disabled]="!canLaunch">
            <mat-icon>rocket_launch</mat-icon>
            Launch Store
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .onboarding-step {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    .step-content {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    }

    .header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .success-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #10b981;
      margin-bottom: 1rem;
    }

    .header h2 {
      margin: 0 0 0.5rem 0;
      color: #374151;
    }

    .header p {
      margin: 0;
      color: #6b7280;
    }

    .review-sections {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .review-card {
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }

    .review-card mat-card-header {
      padding-bottom: 8px;
    }

    .review-card mat-card-header mat-icon[mat-card-avatar] {
      background: #f3f4f6;
      color: #6366f1;
    }

    .review-card mat-card-title {
      color: #374151;
      font-weight: 500;
    }

    .review-card mat-card-header button {
      margin-left: auto;
    }

    .detail-row {
      margin-bottom: 0.75rem;
    }

    .detail-row strong {
      color: #4b5563;
      margin-right: 0.5rem;
    }

    .launch-section {
      margin-bottom: 2rem;
    }

    .launch-card {
      border: 2px solid #10b981;
      border-radius: 12px;
      background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
    }

    .launch-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      align-items: center;
    }

    .launch-info h3 {
      margin: 0 0 1rem 0;
      color: #065f46;
    }

    .launch-info p {
      margin: 0 0 1rem 0;
      color: #374151;
    }

    .launch-info ul {
      margin: 0;
      padding-left: 1.5rem;
      color: #374151;
    }

    .launch-info li {
      margin-bottom: 0.5rem;
    }

    .launch-progress h4 {
      margin: 0 0 1rem 0;
      color: #065f46;
      text-align: center;
    }

    .launch-progress p {
      text-align: center;
      margin: 0.5rem 0 0 0;
      color: #374151;
      font-weight: 500;
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .form-actions button[color="primary"] {
      background: #10b981;
    }

    .form-actions button[color="primary"] mat-icon {
      margin-right: 0.5rem;
    }

    @media (max-width: 768px) {
      .review-sections {
        grid-template-columns: 1fr;
      }
      
      .launch-content {
        grid-template-columns: 1fr;
        text-align: center;
      }
    }

    .categories-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .category-chip {
      background: #e3f2fd;
      color: #1976d2;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      border: 1px solid #bbdefb;
    }

    .language-chip {
      background: #fef3c7;
      color: #d97706;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      border: 1px solid #fcd34d;
    }

    .languages-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  `]
})
export class OnboardingReviewLaunchComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private onboardingService = inject(OnboardingStoreService);
  private router = inject(Router);

  storeData: Partial<OnboardingData> = {};
  completionPercentage = 0;

  constructor() {
    // Load onboarding data
    this.storeData = this.onboardingService.onboardingData();
    this.calculateCompletion();
  }

  private calculateCompletion(): void {
    const steps = this.onboardingService.steps();
    const completedSteps = steps.filter(step => step.completed).length;
    this.completionPercentage = Math.round((completedSteps / steps.length) * 100);
  }

  formatWhatsAppType(type?: string): string {
    const typeMap: { [key: string]: string } = {
      'personal': 'Personal WhatsApp',
      'business': 'Business WhatsApp',
      'none': 'No WhatsApp'
    };
    return typeMap[type || ''] || type || 'Not selected';
  }

  formatState(stateKey?: string): string {
    if (!stateKey) return '';
    const stateMap: { [key: string]: string } = {
      'andhra-pradesh': 'Andhra Pradesh',
      'maharashtra': 'Maharashtra',
      'karnataka': 'Karnataka',
      'tamil-nadu': 'Tamil Nadu',
      'gujarat': 'Gujarat',
      'rajasthan': 'Rajasthan',
      'uttar-pradesh': 'Uttar Pradesh',
      'west-bengal': 'West Bengal',
      'delhi': 'Delhi'
      // Add more state mappings as needed
    };
    return stateMap[stateKey] || stateKey.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  formatCatalogMethod(method?: string | null): string {
    const methodMap: { [key: string]: string } = {
      'excel': 'Excel Upload',
      'manual': 'Manual Entry',
      'voice': 'Voice Input'
    };
    return methodMap[method || ''] || method || 'Not selected';
  }

  formatCategories(categoryIds: string[]): string[] {
    const categoryMap: { [key: string]: string } = {
      'groceries': 'Groceries',
      'electronics': 'Electronics', 
      'fashion': 'Fashion',
      'food-dining': 'Food & Dining',
      'health-wellness': 'Health & Wellness',
      'sports-fitness': 'Sports & Fitness',
      'home-garden': 'Home & Garden',
      'books-education': 'Books & Education',
      'toys-games': 'Toys & Games',
      'beauty-personal-care': 'Beauty & Personal Care',
      'gifts-accessories': 'Gifts & Accessories',
      'others': 'Others'
    };
    return categoryIds.map(id => categoryMap[id] || id);
  }

  formatLanguages(languageIds: string[]): string[] {
    const languageMap: { [key: string]: string } = {
      'hi': 'हिंदी',
      'en': 'English'
    };
    return languageIds.map(id => languageMap[id] || id);
  }

  getOpenDays(): { name: string; hours: string }[] {
    const operatingHours = this.storeData.operatingHours || {};
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return days.map((day, index) => {
      const dayData = operatingHours[day];
      if (dayData?.isOpen) {
        return {
          name: dayNames[index],
          hours: `${dayData.open} - ${dayData.close}`
        };
      } else {
        return {
          name: dayNames[index],
          hours: 'Closed'
        };
      }
    });
  }

  editStep(stepIndex: number): void {
    const steps = this.onboardingService.steps();
    if (stepIndex >= 0 && stepIndex < steps.length) {
      this.onboardingService.goToStep(stepIndex);
      const targetStep = steps[stepIndex];
      if (targetStep) {
        this.router.navigate(['/merchant/onboarding', targetStep.key]);
      }
    }
  }

  get canGoPrevious(): boolean {
    return this.onboardingService.canGoPrevious();
  }

  get canLaunch(): boolean {
    const steps = this.onboardingService.steps();
    // Check if all required steps EXCEPT review-launch itself are completed
    return steps
      .filter(step => step.required && step.key !== 'review-launch')
      .every(step => step.completed);
  }

  onBack(): void {
    this.onboardingService.goToPreviousStep();
  }

  async launchStore(): Promise<void> {
    if (!this.canLaunch) return;

    try {
      // Mark review-launch step as completed first
      const reviewStep = this.onboardingService.steps().find(s => s.key === 'review-launch');
      if (reviewStep) {
        const stepIndex = this.onboardingService.steps().indexOf(reviewStep);
        this.onboardingService.goToStep(stepIndex);
      }
      
      // Complete the onboarding
      this.onboardingService.completeOnboarding();
      
      // In a real app, you would send data to backend here
      console.log('Launching store with data:', this.storeData);
      
      // Navigate immediately without timeout
      await this.router.navigate(['/merchant/dashboard'], {
        queryParams: { newStore: true }
      });
      
    } catch (error) {
      console.error('Failed to launch store:', error);
      // Handle error appropriately
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}