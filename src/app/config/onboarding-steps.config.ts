export interface OnboardingStep {
  id: number;
  key: string;
  title: string;
  subtitle: string;
  component: string;
  required: boolean;
  completed: boolean;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    key: 'store-name',
    title: 'Store Information',
    subtitle: 'What would you like to call your store?',
    component: 'OnboardingStoreNameComponent',
    required: true,
    completed: false
  },
  {
    id: 2,
    key: 'store-description',
    title: 'Store Description',
    subtitle: 'Tell customers what makes your store special',
    component: 'OnboardingStoreDescriptionComponent',
    required: true,
    completed: false
  },
  {
    id: 3,
    key: 'online-presence',
    title: 'Your online presence',
    subtitle: 'Connect your social media and website (optional)',
    component: 'OnboardingOnlinePresenceComponent',
    required: false,
    completed: false
  },
  {
    id: 4,
    key: 'business-details',
    title: 'Business details',
    subtitle: 'Help us understand your business better',
    component: 'OnboardingBusinessDetailsComponent',
    required: true,
    completed: false
  },
  {
    id: 5,
    key: 'category-selection',
    title: 'What do you sell?',
    subtitle: 'Select all categories that apply to your store',
    component: 'OnboardingCategorySelectionComponent',
    required: true,
    completed: false
  },
  {
    id: 6,
    key: 'contact-info',
    title: 'Contact Information',
    subtitle: 'How can customers reach you?',
    component: 'OnboardingContactInfoComponent',
    required: true,
    completed: false
  },
  {
    id: 7,
    key: 'store-location',
    title: 'Store Location',
    subtitle: 'Where is your store located?',
    component: 'OnboardingStoreLocationComponent',
    required: true,
    completed: false
  },
  {
    id: 8,
    key: 'operating-hours',
    title: 'Operating Hours',
    subtitle: 'When is your store open?',
    component: 'OnboardingOperatingHoursComponent',
    required: true,
    completed: false
  },
  {
    id: 9,
    key: 'product-catalog',
    title: 'Product Catalog',
    subtitle: 'Add your products to get started',
    component: 'OnboardingProductCatalogComponent',
    required: true,
    completed: false
  },
  {
    id: 10,
    key: 'language-preference',
    title: 'Preferred language',
    subtitle: 'Select languages for your store (you can choose both)',
    component: 'OnboardingLanguagePreferenceComponent',
    required: true,
    completed: false
  },
  {
    id: 11,
    key: 'review-launch',
    title: 'Review & Launch',
    subtitle: 'Review your store and go live!',
    component: 'OnboardingReviewLaunchComponent',
    required: true,
    completed: false
  }
];