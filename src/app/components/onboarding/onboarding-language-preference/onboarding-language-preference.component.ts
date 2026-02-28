import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OnboardingStoreService } from '../../../services/onboarding-store.service';
import { LanguageService, SupportedLanguage } from '../../../services/language.service';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  description: string;
  countryCode: string;
  selected: boolean;
}

@Component({
  selector: 'app-onboarding-language-preference',
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
          <div class="icon-container">
            <mat-icon class="header-icon">translate</mat-icon>
          </div>
          <h2>{{ 'ONBOARDING.LANGUAGE_PREFERENCE.TITLE' | translate }}</h2>
          <p class="subtitle">{{ 'ONBOARDING.LANGUAGE_PREFERENCE.SUBTITLE' | translate }}</p>
        </div>

        <div class="language-selection-container">
          <div class="languages-list">
            @for (language of languages(); track language.code) {
              <div 
                class="language-option" 
                [class.selected]="language.selected"
                (click)="toggleLanguage(language.code)">
                <div class="language-info">
                  <div class="country-code">{{language.countryCode}}</div>
                  <div class="language-details">
                    <div class="language-name">
                      {{ ('LANGUAGES.' + language.code.toUpperCase()) | translate }}
                    </div>
                    <div class="language-description">{{ ('LANGUAGES.' + language.code.toUpperCase() + '_SUPPORT') | translate }}</div>
                  </div>
                </div>
                <mat-icon 
                  class="check-icon" 
                  [class.visible]="language.selected">
                  check_circle
                </mat-icon>
              </div>
            }
          </div>

          @if (selectedLanguages().length > 0) {
            <div class="selected-indicator">
              <mat-icon class="indicator-icon">lightbulb</mat-icon>
              <span>{{ 'ONBOARDING.LANGUAGE_PREFERENCE.SELECTED' | translate }}: {{getSelectedLanguageNames()}}</span>
            </div>
          }

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
              [disabled]="selectedLanguages().length === 0"
              class="nav-button complete-button">
              <mat-icon>check_circle</mat-icon>
              {{ 'ONBOARDING.LANGUAGE_PREFERENCE.COMPLETE_SETUP' | translate }}
            </button>
          </div>
        </div>
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
      display: inline-block;
      background: #e0f7fa;
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 1rem;
    }

    .header-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #00acc1;
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

    .language-selection-container {
      margin-top: 2rem;
    }

    .languages-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
    }

    .language-option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: white;
    }

    .language-option:hover {
      border-color: #f97316;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(249, 115, 22, 0.1);
    }

    .language-option.selected {
      border-color: #f97316;
      background-color: #fff7ed;
      box-shadow: 0 4px 12px rgba(249, 115, 22, 0.15);
    }

    .language-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .country-code {
      font-size: 18px;
      font-weight: 700;
      color: #374151;
      min-width: 40px;
      text-align: center;
    }

    .language-details {
      flex: 1;
    }

    .language-name {
      font-size: 20px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 4px;
      line-height: 1.4;
    }

    .language-description {
      font-size: 14px;
      color: #6b7280;
    }

    .check-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
      color: #f97316;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .check-icon.visible {
      opacity: 1;
    }

    .selected-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #fef3c7;
      border-radius: 8px;
      margin-bottom: 24px;
    }

    .indicator-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #d97706;
    }

    .selected-indicator span {
      color: #92400e;
      font-weight: 500;
      font-size: 14px;
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
      font-size: 16px;
      font-weight: 500;
    }

    .complete-button {
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%) !important;
      color: white !important;
      box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
    }

    .complete-button:hover {
      background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%) !important;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(249, 115, 22, 0.4);
    }

    .complete-button mat-icon {
      margin-right: 8px;
    }

    @media (max-width: 768px) {
      .language-option {
        padding: 16px;
      }
      
      .language-name {
        font-size: 14px;
      }
      
      .language-description {
        font-size: 12px;
      }
      
      .country-code {
        font-size: 16px;
        min-width: 35px;
      }
      
      .navigation-buttons {
        flex-direction: column;
        gap: 12px;
      }
      
      .nav-button {
        width: 100%;
      }
    }
  `]
})
export class OnboardingLanguagePreferenceComponent implements OnInit {
  languages = signal<Language[]>([
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिंदी',
      description: 'Hindi language support',
      countryCode: 'IN',
      selected: false
    },
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      description: 'English language support',
      countryCode: 'GB',
      selected: false
    }
  ]);

  selectedLanguages = signal<string[]>([]);

  constructor(
    private router: Router,
    private onboardingStore: OnboardingStoreService,
    private languageService: LanguageService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    // Initialize translation service
    this.translateService.addLangs(['en', 'hi']);
    this.translateService.setFallbackLang('en');
    
    // Use the current language from language service or default to 'en'
    const currentLang = this.languageService.currentLanguage() || 'en';
    this.translateService.use(currentLang);
    
    // Load existing selections
    const existingData = this.onboardingStore.onboardingData();
    if (existingData.selectedLanguages) {
      this.selectedLanguages.set([...existingData.selectedLanguages]);
      
      // Update language selection status
      this.languages.update(languages => 
        languages.map(language => ({
          ...language,
          selected: existingData.selectedLanguages?.includes(language.code) || false
        }))
      );
    }
  }

  toggleLanguage(languageCode: string) {
    this.languages.update(languages => 
      languages.map(language => {
        if (language.code === languageCode) {
          const newSelected = !language.selected;
          
          // Update selectedLanguages signal
          if (newSelected) {
            this.selectedLanguages.update(selected => [...selected, languageCode]);
          } else {
            this.selectedLanguages.update(selected => 
              selected.filter(code => code !== languageCode)
            );
          }
          
          return { ...language, selected: newSelected };
        }
        return language;
      })
    );

    // Update store data
    this.onboardingStore.updateData({
      selectedLanguages: this.selectedLanguages()
    });

    // If this is the first language selected, or the only one, set it as current
    const selected = this.selectedLanguages();
    if (selected.length === 1 || languageCode === selected[0]) {
      this.languageService.setLanguage(languageCode);
    }
  }

  getSelectedLanguageNames(): string {
    const selected = this.languages().filter(lang => lang.selected);
    return selected.map(lang => {
      const translationKey = 'LANGUAGES.' + lang.code.toUpperCase();
      return this.translateService.instant(translationKey);
    }).join(', ');
  }

  goNext() {
    // Navigate to next step (review)
    this.onboardingStore.goToNextStep();
    this.router.navigate(['/merchant/onboarding/review-launch']);
  }

  goBack() {
    this.router.navigate(['/merchant/onboarding/product-catalog']);
  }
}