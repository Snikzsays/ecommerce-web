import { Injectable, signal, computed } from '@angular/core';
import { ONBOARDING_STEPS, OnboardingStep } from '../config/onboarding-steps.config';

export interface OnboardingData {
  // Step 1: Store Name
  storeName: string;
  
  // Step 2: Store Description
  storeDescription: string;
  storeTagline: string;
  
  // Step 3: Online Presence
  instagramHandle: string;
  facebookPage: string;
  website: string;
  
  // Step 4: Business Details
  legalBusinessName: string;
  gstNumber: string;
  ownerName: string;
  whatsappBusinessNumber: string;
  whatsappAccountType: string;
  
  // Step 5: Category Selection
  selectedCategories: string[];
  
  // Step 6: Contact Info
  phoneNumber: string;
  email: string;
  whatsappNumber: string;
  
  // Step 7: Store Location
  address: string;
  city: string;
  state: string;
  pincode: string;
  
  // Step 8: Operating Hours
  operatingHours: {
    [key: string]: { open: string; close: string; isOpen: boolean };
  };
  
  // Step 9: Product Catalog
  products: any[];
  catalogMethod: 'excel' | 'manual' | 'voice' | null;
  
  // Step 10: Language Preference
  selectedLanguages: string[];
}

@Injectable({
  providedIn: 'root'
})
export class OnboardingStoreService {
  private readonly STORAGE_KEY = 'onboarding-draft';
  private readonly STORAGE_STEP_KEY = 'onboarding-current-step';
  private readonly COMPLETION_KEY = 'onboarding-completed';
  
  private _currentStepIndex = signal<number>(0);
  private _steps = signal<OnboardingStep[]>([...ONBOARDING_STEPS]);
  private _onboardingData = signal<Partial<OnboardingData>>({});

  // Public signals
  currentStepIndex = this._currentStepIndex.asReadonly();
  steps = this._steps.asReadonly();
  onboardingData = this._onboardingData.asReadonly();

  // Computed values
  currentStep = computed(() => this._steps()[this._currentStepIndex()]);
  isFirstStep = computed(() => this._currentStepIndex() === 0);
  isLastStep = computed(() => this._currentStepIndex() === this._steps().length - 1);
  canGoNext = computed(() => {
    const current = this.currentStep();
    return current ? this.isStepValid(current.key) : false;
  });
  canGoPrevious = computed(() => !this.isFirstStep());
  
  progress = computed(() => {
    const completed = this._steps().filter(step => step.completed).length;
    return Math.round((completed / this._steps().length) * 100);
  });

  constructor() {
    // Load existing draft or initialize with default data
    this.loadDraft();
  }

  // Navigation methods
  goToStep(stepIndex: number): void {
    if (stepIndex >= 0 && stepIndex < this._steps().length) {
      this._currentStepIndex.set(stepIndex);
      this.saveCurrentStep();
    }
  }

  goToNextStep(): void {
    if (this.canGoNext() && !this.isLastStep()) {
      // Mark current step as completed
      this.markStepCompleted(this._currentStepIndex());
      this._currentStepIndex.update(index => index + 1);
      this.saveCurrentStep();
    }
  }

  goToPreviousStep(): void {
    if (this.canGoPrevious()) {
      this._currentStepIndex.update(index => index - 1);
      this.saveCurrentStep();
    }
  }

  // Data management
  updateData(data: Partial<OnboardingData>): void {
    this._onboardingData.update(current => ({ ...current, ...data }));
    this.saveDraft();
  }

  getData<T extends keyof OnboardingData>(key: T): OnboardingData[T] | undefined {
    return this._onboardingData()[key];
  }

  // Step validation
  private isStepValid(stepKey: string): boolean {
    const data = this._onboardingData();
    
    switch (stepKey) {
      case 'store-name':
        return !!(data.storeName && data.storeName.trim().length >= 2);
      
      case 'store-description':
        return !!(data.storeDescription && data.storeDescription.trim().length >= 10);
      
      case 'online-presence':
        return true; // Always valid since all fields are optional
      
      case 'business-details':
        return !!(data.legalBusinessName && data.ownerName && data.whatsappBusinessNumber && data.whatsappAccountType);
      
      case 'category-selection':
        return !!(data.selectedCategories && data.selectedCategories.length > 0);
      
      case 'contact-info':
        return !!(data.phoneNumber && data.email);
      
      case 'store-location':
        return !!(data.address && data.city && data.state && data.pincode);
      
      case 'operating-hours':
        return true; // Default hours are pre-filled
      
      case 'product-catalog':
        return !!(data.catalogMethod && (data.products?.length || 0) > 0);
      
      case 'language-preference':
        return !!(data.selectedLanguages && data.selectedLanguages.length > 0);
      
      case 'review-launch':
        // Check if all OTHER required steps (excluding review-launch itself) are completed
        return this._steps()
          .filter(step => step.required && step.key !== 'review-launch')
          .every(step => step.completed);
      
      default:
        return false;
    }
  }

  private isAllRequiredStepsCompleted(): boolean {
    return this._steps()
      .filter(step => step.required)
      .every(step => step.completed);
  }

  private markStepCompleted(stepIndex: number): void {
    this._steps.update(steps => {
      const updatedSteps = [...steps];
      if (updatedSteps[stepIndex]) {
        updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], completed: true };
      }
      return updatedSteps;
    });
  }

  // Reset onboarding
  resetOnboarding(): void {
    this._currentStepIndex.set(0);
    this._steps.set([...ONBOARDING_STEPS]);
    this._onboardingData.set({});
    this.clearDraft();
  }

  // LocalStorage management
  private saveDraft(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._onboardingData()));
      } catch (error) {
        console.warn('Failed to save onboarding draft:', error);
      }
    }
  }

  private saveCurrentStep(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(this.STORAGE_STEP_KEY, this._currentStepIndex().toString());
      } catch (error) {
        console.warn('Failed to save current step:', error);
      }
    }
  }

  private loadDraft(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        // Load saved data
        const savedData = localStorage.getItem(this.STORAGE_KEY);
        const savedStep = localStorage.getItem(this.STORAGE_STEP_KEY);
        
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          this._onboardingData.set({
            ...this.getDefaultData(),
            ...parsedData
          });
        } else {
          this._onboardingData.set(this.getDefaultData());
        }
        
        // Load current step
        if (savedStep) {
          const stepIndex = parseInt(savedStep, 10);
          if (stepIndex >= 0 && stepIndex < ONBOARDING_STEPS.length) {
            this._currentStepIndex.set(stepIndex);
          }
        }
        
      } catch (error) {
        console.warn('Failed to load onboarding draft:', error);
        this._onboardingData.set(this.getDefaultData());
      }
    } else {
      // Fallback for SSR or environments without localStorage
      this._onboardingData.set(this.getDefaultData());
    }
  }

  private getDefaultData(): Partial<OnboardingData> {
    return {
      storeName: '',
      storeDescription: '',
      storeTagline: '',
      instagramHandle: '',
      facebookPage: '',
      website: '',
      legalBusinessName: '',
      gstNumber: '',
      ownerName: '',
      whatsappBusinessNumber: '',
      whatsappAccountType: '',
      operatingHours: {
        monday: { open: '09:00', close: '18:00', isOpen: true },
        tuesday: { open: '09:00', close: '18:00', isOpen: true },
        wednesday: { open: '09:00', close: '18:00', isOpen: true },
        thursday: { open: '09:00', close: '18:00', isOpen: true },
        friday: { open: '09:00', close: '18:00', isOpen: true },
        saturday: { open: '09:00', close: '18:00', isOpen: true },
        sunday: { open: '10:00', close: '17:00', isOpen: false }
      },
      products: []
    };
  }

  private clearDraft(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.STORAGE_STEP_KEY);
        // Don't remove COMPLETION_KEY - we need it to verify completion
      } catch (error) {
        console.warn('Failed to clear onboarding draft:', error);
      }
    }
  }

  // Check if onboarding is completed
  isOnboardingComplete(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return localStorage.getItem(this.COMPLETION_KEY) === 'true';
      } catch (error) {
        console.warn('Failed to check onboarding completion:', error);
      }
    }
    return false;
  }

  // Check if user has an existing draft
  hasDraft(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return localStorage.getItem(this.STORAGE_KEY) !== null;
      } catch {
        return false;
      }
    }
    return false;
  }

  // Generate store slug from name
  generateSlug(storeName: string): string {
    return storeName
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  // Complete onboarding
  completeOnboarding(): void {
    // Mark all steps as completed
    this._steps.update(steps => 
      steps.map(step => ({ ...step, completed: true }))
    );
    
    // Here you would typically save to backend
    console.log('Onboarding completed with data:', this._onboardingData());
    
    // Save completion flag to localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(this.COMPLETION_KEY, 'true');
      } catch (error) {
        console.warn('Failed to save onboarding completion:', error);
      }
    }
    
    // Clear the draft since onboarding is complete
    this.clearDraft();
    
    // In a real app, navigate to dashboard after successful save
    // this.router.navigate(['/merchant/dashboard']);
  }
}