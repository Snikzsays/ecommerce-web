import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FigmaSyncService, FigmaDesignTokens, FigmaComponentData } from '../../services/figma-sync.service';

@Component({
  selector: 'app-figma-integration',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './figma-integration.html',
  styleUrls: ['./figma-integration.scss']
})
export class FigmaIntegrationComponent implements OnInit {
  // Configuration
  figmaApiKey: string = '';
  figmaFileKey: string = '';
  isConfigured: boolean = false;
  
  // Status
  isLoading: boolean = false;
  syncStatus: string = '';
  lastSyncTime: Date | null = null;
  
  // Data
  designTokens: FigmaDesignTokens | null = null;
  productCardComponents: FigmaComponentData[] = [];
  catalogLayouts: FigmaComponentData[] = [];
  
  constructor(private figmaSyncService: FigmaSyncService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // Check if already configured
    this.loadStoredConfiguration();
    
    // Subscribe to design tokens
    this.figmaSyncService.designTokens$.subscribe(tokens => {
      this.designTokens = tokens;
      if (tokens) {
        this.lastSyncTime = new Date();
        this.syncStatus = 'Design tokens synced successfully';
      }
    });
  }

  private loadStoredConfiguration(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip localStorage access during SSR
    }
    
    const storedApiKey = localStorage.getItem('figma_api_key');
    const storedFileKey = localStorage.getItem('figma_file_key');
    
    if (storedApiKey && storedFileKey) {
      this.figmaApiKey = storedApiKey;
      this.figmaFileKey = storedFileKey;
      this.isConfigured = true;
    }
  }

  configureFigma(): void {
    if (!this.figmaApiKey.trim() || !this.figmaFileKey.trim()) {
      this.syncStatus = 'Please provide both API key and file key';
      return;
    }
    
    this.figmaSyncService.configure(this.figmaApiKey.trim(), this.figmaFileKey.trim());
    this.isConfigured = true;
    this.syncStatus = 'Figma API configured successfully';
  }

  async syncDesignTokens(): Promise<void> {
    if (!this.isConfigured) {
      this.syncStatus = 'Please configure Figma API first';
      return;
    }
    
    this.isLoading = true;
    this.syncStatus = 'Syncing design tokens from Figma...';
    
    try {
      await this.figmaSyncService.syncDesignTokens();
      this.syncStatus = 'Design tokens synced successfully!';
    } catch (error) {
      this.syncStatus = `Error: ${error}`;
      console.error('Sync error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async syncProductCards(): Promise<void> {
    if (!this.isConfigured) {
      this.syncStatus = 'Please configure Figma API first';
      return;
    }
    
    this.isLoading = true;
    this.syncStatus = 'Extracting product card components...';
    
    try {
      this.productCardComponents = await this.figmaSyncService.getProductCardComponents();
      this.syncStatus = `Found ${this.productCardComponents.length} product card components`;
    } catch (error) {
      this.syncStatus = `Error: ${error}`;
      console.error('Product card sync error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async syncCatalogLayouts(): Promise<void> {
    if (!this.isConfigured) {
      this.syncStatus = 'Please configure Figma API first';
      return;
    }
    
    this.isLoading = true;
    this.syncStatus = 'Extracting catalog layouts...';
    
    try {
      this.catalogLayouts = await this.figmaSyncService.getCatalogLayouts();
      this.syncStatus = `Found ${this.catalogLayouts.length} catalog layout components`;
    } catch (error) {
      this.syncStatus = `Error: ${error}`;
      console.error('Catalog layout sync error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  applyDesignTokens(): void {
    if (!this.designTokens) {
      this.syncStatus = 'No design tokens available. Please sync first.';
      return;
    }
    
    this.figmaSyncService.applyDesignTokens(this.designTokens);
    this.syncStatus = 'Design tokens applied to your catalog!';
  }

  generateAngularComponent(component: FigmaComponentData): void {
    const code = this.figmaSyncService.generateAngularComponent(component);
    this.downloadFile(`${component.name.toLowerCase()}.component.ts`, code);
    this.syncStatus = `Angular component generated for ${component.name}`;
  }

  private downloadFile(filename: string, content: string): void {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  resetConfiguration(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('figma_api_key');
      localStorage.removeItem('figma_file_key');
      localStorage.removeItem('figma_design_tokens');
    }
    
    this.figmaApiKey = '';
    this.figmaFileKey = '';
    this.isConfigured = false;
    this.designTokens = null;
    this.productCardComponents = [];
    this.catalogLayouts = [];
    this.syncStatus = 'Configuration reset';
  }

  // Utility methods for template
  formatDate(date: Date | null): string {
    return date ? date.toLocaleString() : 'Never';
  }

  getColorValue(color: any): string {
    return typeof color === 'string' ? color : JSON.stringify(color);
  }
}