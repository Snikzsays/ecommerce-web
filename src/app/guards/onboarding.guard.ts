import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { OnboardingStoreService } from '../services/onboarding-store.service';

@Injectable({
  providedIn: 'root'
})
export class OnboardingGuard implements CanActivate, CanActivateChild {

  constructor(
    private onboardingService: OnboardingStoreService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    return this.checkOnboardingAccess();
  }

  canActivateChild(): boolean | UrlTree {
    return this.checkOnboardingAccess();
  }

  private checkOnboardingAccess(): boolean | UrlTree {
    // Check if onboarding is already completed
    const isCompleted = this.onboardingService.isOnboardingComplete();
    
    // If onboarding is complete, redirect to dashboard
    if (isCompleted) {
      return this.router.createUrlTree(['/merchant/dashboard']);
    }

    // Allow access to onboarding
    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class OnboardingCompleteGuard implements CanActivate {

  constructor(
    private onboardingService: OnboardingStoreService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    // Check if onboarding is completed via localStorage flag
    const isCompleted = this.onboardingService.isOnboardingComplete();
    
    // Also check if all required steps are marked complete
    const steps = this.onboardingService.steps();
    const allRequiredCompleted = steps
      .filter(step => step.required)
      .every(step => step.completed);

    // If onboarding is not complete, redirect to onboarding
    if (!isCompleted && !allRequiredCompleted) {
      return this.router.createUrlTree(['/merchant/onboarding']);
    }

    // Allow access to post-onboarding routes
    return true;
  }
}