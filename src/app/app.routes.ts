import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CatalogComponent } from './components/catalog/catalog';
import { OnboardingGuard, OnboardingCompleteGuard } from './guards/onboarding.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/catalog',
    pathMatch: 'full',
  },
  {
    path: 'catalog',
    component: CatalogComponent,
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./components/product-details/product-details.component').then(m => m.ProductDetailsComponent),
  },
  {
    path: 'customer/catalog',
    redirectTo: '/catalog',
    pathMatch: 'full',
  },
  {
    path: 'merchant',
    redirectTo: '/merchant/onboarding',
    pathMatch: 'full',
  },
  {
    path: 'merchant/onboarding',
    loadComponent: () => import('./components/onboarding-shell/onboarding-shell.component').then(m => m.OnboardingShellComponent),
    canActivate: [OnboardingGuard],
    canActivateChild: [OnboardingGuard],
    children: [
      {
        path: '',
        redirectTo: 'store-name',
        pathMatch: 'full'
      },
      {
        path: 'store-name',
        loadComponent: () => import('./components/onboarding-steps/store-name/onboarding-store-name.component').then(m => m.OnboardingStoreNameComponent)
      },
      {
        path: 'store-description',
        loadComponent: () => import('./components/onboarding-steps/store-description/onboarding-store-description.component').then(m => m.OnboardingStoreDescriptionComponent)
      },
      {
        path: 'online-presence',
        loadComponent: () => import('./components/onboarding-steps/online-presence/onboarding-online-presence.component').then(m => m.OnboardingOnlinePresenceComponent)
      },
      {
        path: 'business-details',
        loadComponent: () => import('./components/onboarding-steps/business-details/onboarding-business-details.component').then(m => m.OnboardingBusinessDetailsComponent)
      },
      {
        path: 'category-selection',
        loadComponent: () => import('./components/onboarding/onboarding-category-selection/onboarding-category-selection.component').then(m => m.OnboardingCategorySelectionComponent)
      },
      {
        path: 'contact-info',
        loadComponent: () => import('./components/onboarding-steps/contact-info/onboarding-contact-info.component').then(m => m.OnboardingContactInfoComponent)
      },
      {
        path: 'store-location',
        loadComponent: () => import('./components/onboarding-steps/store-location/onboarding-store-location.component').then(m => m.OnboardingStoreLocationComponent)
      },
      {
        path: 'operating-hours',
        loadComponent: () => import('./components/onboarding-steps/operating-hours/onboarding-operating-hours.component').then(m => m.OnboardingOperatingHoursComponent)
      },
      {
        path: 'product-catalog',
        loadComponent: () => import('./components/onboarding-steps/product-catalog/onboarding-product-catalog.component').then(m => m.OnboardingProductCatalogComponent)
      },
      {
        path: 'language-preference',
        loadComponent: () => import('./components/onboarding/onboarding-language-preference/onboarding-language-preference.component').then(m => m.OnboardingLanguagePreferenceComponent)
      },
      {
        path: 'review-launch',
        loadComponent: () => import('./components/onboarding-steps/review-launch/onboarding-review-launch.component').then(m => m.OnboardingReviewLaunchComponent)
      }
    ]
  },
  {
    path: 'merchant/dashboard',
    loadComponent: () => import('./components/merchant-dashboard/merchant-dashboard.component').then(m => m.MerchantDashboardComponent),
    canActivate: [OnboardingCompleteGuard]
  },
  {
    path: 'merchant/design-tools',
    loadComponent: () => import('./components/figjam-code-export/figjam-code-export').then(m => m.FigJamCodeExportComponent),
    canActivate: [OnboardingCompleteGuard]
  },
];