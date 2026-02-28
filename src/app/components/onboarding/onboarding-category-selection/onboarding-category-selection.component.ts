import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { OnboardingStoreService } from '../../../services/onboarding-store.service';

interface ProductCategory {
  id: string;
  name: string;
  icon: string;
  selected: boolean;
}

@Component({
  selector: 'app-onboarding-category-selection',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    TranslateModule
  ],
  template: `
    <div class="onboarding-step">
      <div class="step-content">
        <div class="header-section">
          <h2>{{ 'ONBOARDING.CATEGORY_SELECTION.TITLE' | translate }}</h2>
          <p class="subtitle">{{ 'ONBOARDING.CATEGORY_SELECTION.SUBTITLE' | translate }}</p>
        </div>

        <div class="category-selection-container">
          <div class="categories-grid">
        @for (category of categories(); track category.id) {
          <mat-card 
            class="category-card" 
            [class.selected]="category.selected"
            (click)="toggleCategory(category.id)">
            <mat-card-content class="category-content">
              <mat-icon class="category-icon">{{category.icon}}</mat-icon>
              <h3 class="category-name">{{category.name}}</h3>
              <mat-checkbox 
                [checked]="category.selected"
                (click)="$event.stopPropagation()"
                (change)="toggleCategory(category.id)"
                class="category-checkbox">
              </mat-checkbox>
            </mat-card-content>
          </mat-card>
        }
      </div>

      <div class="navigation-buttons">
        <button 
          mat-stroked-button 
          (click)="goBack()" 
          class="nav-button">
          {{ 'ONBOARDING.NAVIGATION.PREVIOUS' | translate }}
        </button>
        <button 
          mat-raised-button 
          color="primary" 
          (click)="goNext()" 
          [disabled]="selectedCategories().length === 0"
          class="nav-button">
          {{ 'ONBOARDING.NAVIGATION.CONTINUE' | translate }}
        </button>
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

    .header-section {
      text-align: center;
      margin-bottom: 2rem;
    }

    .header-section h2 {
      font-size: 1.875rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: #1f2937;
    }

    .subtitle {
      font-size: 1rem;
      color: #6b7280;
      margin: 0;
    }

    .category-selection-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .category-card {
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      height: 140px;
    }

    .category-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .category-card.selected {
      border-color: #1976d2;
      background-color: #e3f2fd;
    }

    .category-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      text-align: center;
      padding: 16px 8px 8px 8px;
    }

    .category-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #1976d2;
      margin-bottom: 8px;
    }

    .category-name {
      font-size: 14px;
      font-weight: 500;
      margin: 0;
      line-height: 1.2;
      flex-grow: 1;
      display: flex;
      align-items: center;
    }

    .category-checkbox {
      margin-top: auto;
    }

    .navigation-buttons {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      margin-top: 24px;
    }

    .nav-button {
      min-width: 120px;
      height: 48px;
    }

    @media (max-width: 768px) {
      .categories-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 12px;
      }
      
      .category-card {
        height: 120px;
      }
      
      .category-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }
      
      .category-name {
        font-size: 13px;
      }
    }
  `]
})
export class OnboardingCategorySelectionComponent implements OnInit {
  categories = signal<ProductCategory[]>([
    { id: 'groceries', name: 'Groceries', icon: 'shopping_cart', selected: false },
    { id: 'electronics', name: 'Electronics', icon: 'devices', selected: false },
    { id: 'fashion', name: 'Fashion', icon: 'checkroom', selected: false },
    { id: 'food-dining', name: 'Food & Dining', icon: 'restaurant', selected: false },
    { id: 'health-wellness', name: 'Health & Wellness', icon: 'health_and_safety', selected: false },
    { id: 'sports-fitness', name: 'Sports & Fitness', icon: 'fitness_center', selected: false },
    { id: 'home-garden', name: 'Home & Garden', icon: 'home', selected: false },
    { id: 'books-education', name: 'Books & Education', icon: 'menu_book', selected: false },
    { id: 'toys-games', name: 'Toys & Games', icon: 'toys', selected: false },
    { id: 'beauty-personal-care', name: 'Beauty & Personal Care', icon: 'face', selected: false },
    { id: 'gifts-accessories', name: 'Gifts & Accessories', icon: 'card_giftcard', selected: false },
    { id: 'others', name: 'Others', icon: 'more_horiz', selected: false }
  ]);

  selectedCategories = signal<string[]>([]);

  constructor(
    private router: Router,
    private onboardingStore: OnboardingStoreService
  ) {}

  ngOnInit() {
    // Load existing selections
    const existingData = this.onboardingStore.onboardingData();
    if (existingData.selectedCategories) {
      this.selectedCategories.set([...existingData.selectedCategories]);
      
      // Update category selection status
      this.categories.update(categories => 
        categories.map(category => ({
          ...category,
          selected: existingData.selectedCategories?.includes(category.id) || false
        }))
      );
    }
  }

  toggleCategory(categoryId: string) {
    this.categories.update(categories => 
      categories.map(category => {
        if (category.id === categoryId) {
          const newSelected = !category.selected;
          
          // Update selectedCategories signal
          if (newSelected) {
            this.selectedCategories.update(selected => [...selected, categoryId]);
          } else {
            this.selectedCategories.update(selected => 
              selected.filter(id => id !== categoryId)
            );
          }
          
          return { ...category, selected: newSelected };
        }
        return category;
      })
    );

    // Update store data
    this.onboardingStore.updateData({
      selectedCategories: this.selectedCategories()
    });
  }

  goNext() {
    // Navigate to next step
    this.onboardingStore.goToNextStep();
    this.router.navigate(['/merchant/onboarding/contact-info']);
  }

  goBack() {
    this.router.navigate(['/merchant/onboarding/business-details']);
  }
}