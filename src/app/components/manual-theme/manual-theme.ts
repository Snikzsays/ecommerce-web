import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ManualThemeService, ManualDesignTokens } from '../../services/manual-theme.service';

@Component({
  selector: 'app-manual-theme',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './manual-theme.html',
  styleUrls: ['./manual-theme.scss']
})
export class ManualThemeComponent implements OnInit {
  
  // Theme configuration
  designTokens: ManualDesignTokens = {
    colors: {
      primary: '#FF6B35',
      secondary: '#FFA726', 
      accent: '#FF8C42',
      background: '#F5F5F5',
      surface: '#FFFFFF',
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336'
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

  // UI state
  activeTab: 'colors' | 'typography' | 'spacing' = 'colors';
  previewMode: boolean = false;

  constructor(private manualThemeService: ManualThemeService) {}

  ngOnInit(): void {
    // Only load the theme if we're in the browser
    if (typeof window !== 'undefined') {
      this.loadVUBrewHouseTheme();
    }
  }

  loadVUBrewHouseTheme(): void {
    this.designTokens = this.manualThemeService.getVUBrewHouseTheme();
    this.applyTheme();
  }

  applyTheme(): void {
    this.manualThemeService.applyManualTheme(this.designTokens);
  }

  resetTheme(): void {
    this.designTokens = this.manualThemeService.getVUBrewHouseTheme();
    this.applyTheme();
  }

  exportTheme(): void {
    const themeConfig = JSON.stringify(this.designTokens, null, 2);
    this.downloadFile('vu-brew-house-theme.json', themeConfig);
  }

  importTheme(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        this.designTokens = imported;
        this.applyTheme();
      } catch (error) {
        console.error('Invalid theme file:', error);
      }
    };
    reader.readAsText(file);
  }

  navigateToPreview(): void {
    // Apply theme and navigate to catalog to see changes
    this.applyTheme();
    window.open('/tea-catalog', '_blank');
  }

  private downloadFile(filename: string, content: string): void {
    const blob = new Blob([content], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Color category helpers
  getColorCategories() {
    return [
      { key: 'primary', label: 'Primary', description: 'Main brand color' },
      { key: 'secondary', label: 'Secondary', description: 'Secondary brand color' },
      { key: 'accent', label: 'Accent', description: 'Accent/highlight color' },
      { key: 'background', label: 'Background', description: 'Page background' },
      { key: 'surface', label: 'Surface', description: 'Card/surface background' },
      { key: 'success', label: 'Success', description: 'Success states' },
      { key: 'warning', label: 'Warning', description: 'Warning states' },
      { key: 'error', label: 'Error', description: 'Error states' }
    ];
  }

  updateColorValue(colorKey: string, value: string): void {
    (this.designTokens.colors as any)[colorKey] = value;
    this.applyTheme();
  }

  updateTypography(type: 'heading' | 'body' | 'caption', property: 'size' | 'weight', value: string): void {
    this.designTokens.typography[type][property] = value;
    this.applyTheme();
  }

  updateSpacing(key: string, value: string): void {
    (this.designTokens.spacing as any)[key] = value;
    this.applyTheme();
  }

  // Helper methods for template
  getColorValue(key: string): string {
    return (this.designTokens.colors as any)[key];
  }

  getSpacingValue(key: string): string {
    return (this.designTokens.spacing as any)[key];
  }
}