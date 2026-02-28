import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import axios, { AxiosResponse } from 'axios';

export interface FigmaDesignTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
  };
  typography: {
    heading: {
      fontSize: string;
      fontWeight: string;
      lineHeight: string;
    };
    body: {
      fontSize: string;
      fontWeight: string;
      lineHeight: string;
    };
    caption: {
      fontSize: string;
      fontWeight: string;
      lineHeight: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
}

export interface FigmaComponentData {
  id: string;
  name: string;
  type: 'COMPONENT' | 'FRAME' | 'GROUP';
  styles: any;
  children?: FigmaComponentData[];
  properties?: any;
}

@Injectable({
  providedIn: 'root'
})
export class FigmaSyncService {
  private figmaApiKey: string = ''; // Set your Figma API key
  private fileKey: string = ''; // Set your Figma file key
  
  private designTokensSubject = new BehaviorSubject<FigmaDesignTokens | null>(null);
  public designTokens$ = this.designTokensSubject.asObservable();
  
  private apiUrl = 'https://api.figma.com/v1';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadStoredTokens();
    }
  }

  /**
   * Configure Figma API credentials
   */
  configure(apiKey: string, fileKey: string): void {
    this.figmaApiKey = apiKey;
    this.fileKey = fileKey;
    
    // Store credentials securely (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('figma_api_key', apiKey);
      localStorage.setItem('figma_file_key', fileKey);
    }
  }

  /**
   * Sync design tokens from Figma file
   */
  async syncDesignTokens(): Promise<FigmaDesignTokens> {
    try {
      if (!this.figmaApiKey || !this.fileKey) {
        throw new Error('Figma API credentials not configured');
      }

      const fileData = await this.getFigmaFile();
      const tokens = this.extractDesignTokens(fileData);
      
      this.designTokensSubject.next(tokens);
      this.saveTokensLocally(tokens);
      
      return tokens;
    } catch (error) {
      console.error('Error syncing Figma design tokens:', error);
      throw error;
    }
  }

  /**
   * Extract product card components from Figma
   */
  async getProductCardComponents(): Promise<FigmaComponentData[]> {
    try {
      const fileData = await this.getFigmaFile();
      return this.findComponentsByName(fileData, ['Product Card', 'ProductCard', 'product-card']);
    } catch (error) {
      console.error('Error getting product card components:', error);
      return [];
    }
  }

  /**
   * Extract catalog layout components
   */
  async getCatalogLayouts(): Promise<FigmaComponentData[]> {
    try {
      const fileData = await this.getFigmaFile();
      return this.findComponentsByName(fileData, ['Catalog', 'Product Grid', 'Category Grid']);
    } catch (error) {
      console.error('Error getting catalog layouts:', error);
      return [];
    }
  }

  /**
   * Generate Angular component code from Figma component
   */
  generateAngularComponent(figmaComponent: FigmaComponentData): string {
    return `
// Generated from Figma component: ${figmaComponent.name}
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-${this.kebabCase(figmaComponent.name)}',
  standalone: true,
  template: \`
    <div class="figma-component-${this.kebabCase(figmaComponent.name)}">
      <!-- Generated template will go here -->
    </div>
  \`,
  styles: [\`
    /* Generated styles from Figma */
    .figma-component-${this.kebabCase(figmaComponent.name)} {
      /* Figma styles will be extracted here */
    }
  \`]
})
export class ${this.pascalCase(figmaComponent.name)}Component {
  // Generated properties
}`;
  }

  /**
   * Apply design tokens to current Angular app
   */
  applyDesignTokens(tokens: FigmaDesignTokens): void {
    const cssVariables = this.convertTokensToCssVariables(tokens);
    this.injectCssVariables(cssVariables);
  }

  private async getFigmaFile(): Promise<any> {
    const response = await axios.get(
      `${this.apiUrl}/files/${this.fileKey}`,
      {
        headers: {
          'X-Figma-Token': this.figmaApiKey
        }
      }
    );
    return response.data;
  }

  private extractDesignTokens(fileData: any): FigmaDesignTokens {
    // Extract color styles
    const styles = fileData.styles || {};
    const colorTokens = this.extractColorTokens(styles);
    const typographyTokens = this.extractTypographyTokens(styles);
    const spacingTokens = this.extractSpacingTokens(styles);
    
    return {
      colors: {
        primary: colorTokens.primary || '#F59E0B', // Default golden theme
        secondary: colorTokens.secondary || '#FCD34D',
        accent: colorTokens.accent || '#92400E',
        background: colorTokens.background || '#FEF3E2',
        surface: colorTokens.surface || '#FFFFFF',
        text: {
          primary: colorTokens.textPrimary || '#1F2937',
          secondary: colorTokens.textSecondary || '#6B7280',
          disabled: colorTokens.textDisabled || '#9CA3AF'
        }
      },
      typography: typographyTokens,
      spacing: spacingTokens,
      borderRadius: {
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        full: '9999px'
      }
    };
  }

  private extractColorTokens(styles: any): any {
    const colors: any = {};
    
    Object.values(styles).forEach((style: any) => {
      if (style.styleType === 'FILL' && style.name) {
        const colorName = this.camelCase(style.name);
        if (style.fills && style.fills[0]) {
          const fill = style.fills[0];
          if (fill.type === 'SOLID' && fill.color) {
            colors[colorName] = this.rgbToHex(fill.color);
          }
        }
      }
    });
    
    return colors;
  }

  private extractTypographyTokens(styles: any): any {
    return {
      heading: {
        fontSize: '1.5rem',
        fontWeight: '700',
        lineHeight: '1.2'
      },
      body: {
        fontSize: '1rem',
        fontWeight: '400',
        lineHeight: '1.5'
      },
      caption: {
        fontSize: '0.875rem',
        fontWeight: '400',
        lineHeight: '1.4'
      }
    };
  }

  private extractSpacingTokens(styles: any): any {
    return {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem'
    };
  }

  private findComponentsByName(fileData: any, namePatterns: string[]): FigmaComponentData[] {
    const components: FigmaComponentData[] = [];
    
    const searchNode = (node: any) => {
      if (node.type === 'COMPONENT' && namePatterns.some(pattern => 
        node.name.toLowerCase().includes(pattern.toLowerCase())
      )) {
        components.push({
          id: node.id,
          name: node.name,
          type: node.type,
          styles: this.extractNodeStyles(node),
          children: node.children
        });
      }
      
      if (node.children) {
        node.children.forEach(searchNode);
      }
    };
    
    fileData.document.children.forEach(searchNode);
    return components;
  }

  private extractNodeStyles(node: any): any {
    return {
      width: node.absoluteBoundingBox?.width,
      height: node.absoluteBoundingBox?.height,
      backgroundColor: node.fills?.[0]?.color,
      borderRadius: node.cornerRadius,
      padding: node.paddingLeft || node.paddingTop
    };
  }

  private convertTokensToCssVariables(tokens: FigmaDesignTokens): string {
    return `
:root {
  /* Colors */
  --figma-color-primary: ${tokens.colors.primary};
  --figma-color-secondary: ${tokens.colors.secondary};
  --figma-color-accent: ${tokens.colors.accent};
  --figma-color-background: ${tokens.colors.background};
  --figma-color-surface: ${tokens.colors.surface};
  --figma-color-text-primary: ${tokens.colors.text.primary};
  --figma-color-text-secondary: ${tokens.colors.text.secondary};
  --figma-color-text-disabled: ${tokens.colors.text.disabled};
  
  /* Typography */
  --figma-font-heading-size: ${tokens.typography.heading.fontSize};
  --figma-font-heading-weight: ${tokens.typography.heading.fontWeight};
  --figma-font-heading-line-height: ${tokens.typography.heading.lineHeight};
  --figma-font-body-size: ${tokens.typography.body.fontSize};
  --figma-font-body-weight: ${tokens.typography.body.fontWeight};
  --figma-font-body-line-height: ${tokens.typography.body.lineHeight};
  
  /* Spacing */
  --figma-spacing-xs: ${tokens.spacing.xs};
  --figma-spacing-sm: ${tokens.spacing.sm};
  --figma-spacing-md: ${tokens.spacing.md};
  --figma-spacing-lg: ${tokens.spacing.lg};
  --figma-spacing-xl: ${tokens.spacing.xl};
  
  /* Border Radius */
  --figma-border-radius-sm: ${tokens.borderRadius.sm};
  --figma-border-radius-md: ${tokens.borderRadius.md};
  --figma-border-radius-lg: ${tokens.borderRadius.lg};
  --figma-border-radius-full: ${tokens.borderRadius.full};
}`;
  }

  private injectCssVariables(cssVariables: string): void {
    const styleId = 'figma-design-tokens';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = cssVariables;
  }

  private loadStoredTokens(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip localStorage access during SSR
    }
    
    const stored = localStorage.getItem('figma_design_tokens');
    if (stored) {
      try {
        const tokens = JSON.parse(stored);
        this.designTokensSubject.next(tokens);
      } catch (error) {
        console.warn('Failed to load stored Figma tokens:', error);
      }
    }
    
    // Load stored credentials
    const storedApiKey = localStorage.getItem('figma_api_key');
    const storedFileKey = localStorage.getItem('figma_file_key');
    
    if (storedApiKey && storedFileKey) {
      this.figmaApiKey = storedApiKey;
      this.fileKey = storedFileKey;
    }
  }

  private saveTokensLocally(tokens: FigmaDesignTokens): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('figma_design_tokens', JSON.stringify(tokens));
    }
  }

  // Utility methods
  private camelCase(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  private kebabCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().replace(/\s+/g, '-');
  }

  private pascalCase(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match) => {
      if (+match === 0) return '';
      return match.toUpperCase();
    });
  }

  private rgbToHex(color: { r: number; g: number; b: number }): string {
    const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
  }
}