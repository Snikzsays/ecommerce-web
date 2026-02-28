import { Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

export interface ManualDesignTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    heading: { size: string; weight: string; };
    body: { size: string; weight: string; };
    caption: { size: string; weight: string; };
  };
}

@Injectable({
  providedIn: 'root'
})
export class ManualThemeService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  
  /**
   * Extract colors from your FigJam design and apply manually
   */
  applyManualTheme(tokens: ManualDesignTokens): void {
    const cssVariables = `
      :root {
        /* Colors from your FigJam design */
        --primary-color: ${tokens.colors.primary};
        --secondary-color: ${tokens.colors.secondary};
        --accent-color: ${tokens.colors.accent};
        --background-color: ${tokens.colors.background};
        --surface-color: ${tokens.colors.surface};
        --success-color: ${tokens.colors.success};
        --warning-color: ${tokens.colors.warning};
        --error-color: ${tokens.colors.error};
        
        /* Typography */
        --heading-size: ${tokens.typography.heading.size};
        --heading-weight: ${tokens.typography.heading.weight};
        --body-size: ${tokens.typography.body.size};
        --body-weight: ${tokens.typography.body.weight};
        
        /* Spacing */
        --spacing-xs: ${tokens.spacing.xs};
        --spacing-sm: ${tokens.spacing.sm};
        --spacing-md: ${tokens.spacing.md};
        --spacing-lg: ${tokens.spacing.lg};
        --spacing-xl: ${tokens.spacing.xl};
      }
    `;
    
    this.injectCSS(cssVariables);
  }
  
  /**
   * Based on your FigJam screenshot - VU's Brew House colors
   */
  getVUBrewHouseTheme(): ManualDesignTokens {
    return {
      colors: {
        primary: '#FF6B35',      // Orange from buttons
        secondary: '#FFA726',    // Golden header
        accent: '#FF8C42',       // Accent orange
        background: '#F5F5F5',   // Light background
        surface: '#FFFFFF',      // White cards
        success: '#4CAF50',      // Green badges
        warning: '#FF9800',      // Orange warnings
        error: '#F44336'         // Red errors
      },
      spacing: {
        xs: '0.5rem',
        sm: '1rem', 
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem'
      },
      typography: {
        heading: { size: '1.5rem', weight: '700' },
        body: { size: '1rem', weight: '400' },
        caption: { size: '0.875rem', weight: '400' }
      }
    };
  }
  
  private injectCSS(css: string): void {
    // Only inject CSS if we're in a browser environment
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    const styleId = 'manual-theme-tokens';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = css;
  }
}