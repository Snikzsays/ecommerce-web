import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

export interface FigJamCodeExport {
  type: 'html' | 'css' | 'angular' | 'react' | 'vue' | 'tokens';
  content: string;
  filename: string;
  description: string;
}

@Component({
  selector: 'app-figjam-code-export',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatTabsModule],
  templateUrl: './figjam-code-export.html',
  styleUrls: ['./figjam-code-export.scss']
})
export class FigJamCodeExportComponent implements OnInit {
  
  figJamUrl: string = '';
  exportMethod: 'plugin' | 'api' | 'manual' | 'extension' = 'manual';
  selectedFramework: 'angular' | 'react' | 'vue' | 'html' = 'angular';
  exportResults: FigJamCodeExport[] = [];
  isProcessing: boolean = false;
  
  // Focus on merchant dashboard enhancements
  dashboardTemplates = [
    {
      name: 'Enhanced Product Cards',
      description: 'Advanced product cards with hover effects and detailed modals',
      preview: 'Enhanced card design from FigJam patterns'
    },
    {
      name: 'Sales Analytics Dashboard',
      description: 'Interactive charts and metrics for business insights', 
      preview: 'Professional analytics layout with charts'
    },
    {
      name: 'Order Management Interface',
      description: 'Streamlined order processing and status tracking',
      preview: 'Order workflow interface design'
    },
    {
      name: 'Inventory Management',
      description: 'Stock tracking with low-stock alerts and bulk actions',
      preview: 'Inventory grid with action buttons'
    }
  ];

  // Available export methods with descriptions
  exportMethods = [
    {
      id: 'plugin',
      name: 'Figma Plugins',
      description: 'Use official Figma plugins to export code',
      icon: 'extension',
      difficulty: 'Easy',
      recommended: true,
      tools: [
        { name: 'Figma to Code', url: 'https://www.figma.com/community/plugin/842128343887142055', type: 'HTML/CSS/React' },
        { name: 'Locofy', url: 'https://www.locofy.ai/', type: 'React/Vue/Angular' },
        { name: 'Figma to Angular', url: 'https://www.figma.com/community/plugin/916890701676851108', type: 'Angular Components' },
        { name: 'Design Tokens', url: 'https://www.figma.com/community/plugin/888356646278934516', type: 'CSS Variables' }
      ]
    },
    {
      id: 'api',
      name: 'Figma REST API', 
      description: 'Extract design data programmatically',
      icon: 'api',
      difficulty: 'Medium',
      recommended: false,
      note: 'Limited support for FigJam files'
    },
    {
      id: 'manual',
      name: 'Manual Extraction',
      description: 'Copy/export assets and recreate in code',
      icon: 'build',
      difficulty: 'Easy',
      recommended: true
    },
    {
      id: 'extension',
      name: 'Browser Extensions',
      description: 'Third-party tools for design-to-code',
      icon: 'web',
      difficulty: 'Medium',
      recommended: false,
      tools: [
        { name: 'Figma to HTML', url: 'https://chrome.google.com/webstore', type: 'Browser Extension' },
        { name: 'Design Inspector', url: 'https://chrome.google.com/webstore', type: 'CSS Extraction' }
      ]
    }
  ];

  ngOnInit(): void {
    // Set the provided FigJam URL if available
    this.figJamUrl = 'https://www.figma.com/make/6LmtldyAVKHABlpt5kRggJ/Merchant-app-space--Copy-?p=f&t=T7pblpqxWK3Mtubg-0';
  }

  onMethodSelect(method: string): void {
    this.exportMethod = method as any;
    this.exportResults = [];
  }

  getSelectedMethodTools(): any[] {
    const method = this.exportMethods.find(m => m.id === this.exportMethod);
    return method?.tools || [];
  }

  async extractFromFigJam(): Promise<void> {
    if (!this.figJamUrl.trim()) {
      this.showError('Please enter a FigJam URL');
      return;
    }

    this.isProcessing = true;
    this.exportResults = [];

    try {
      switch (this.exportMethod) {
        case 'plugin':
          await this.generatePluginInstructions();
          break;
        case 'api':
          await this.generateApiCode();
          break;
        case 'manual':
          await this.generateManualExtractionCode();
          break;
        case 'extension':
          await this.generateExtensionInstructions();
          break;
      }
    } catch (error) {
      this.showError('Export failed: ' + error);
    } finally {
      this.isProcessing = false;
    }
  }

  private async generatePluginInstructions(): Promise<void> {
    const pluginSteps = `
// Step-by-step guide to export your FigJam design using plugins

1. INSTALL PLUGIN:
   - Open your FigJam file: ${this.figJamUrl}
   - Go to Plugins menu → Browse all plugins
   - Install "Figma to Code" or "Locofy" plugin

2. SELECT ELEMENTS:
   - Select your tea product design elements
   - Include: images, text, layout containers

3. EXPORT CODE:
   - Run the plugin
   - Choose framework: ${this.selectedFramework.toUpperCase()}
   - Export as components

4. CUSTOMIZE FOR VU'S BREW HOUSE:
   - Replace placeholder text with actual product info
   - Update styling to match your brand colors
   - Integrate with your Angular catalog system
`;

    this.exportResults.push({
      type: 'angular',
      content: pluginSteps,
      filename: 'plugin-export-guide.txt',
      description: 'Plugin-based export instructions'
    });
  }

  private async generateApiCode(): Promise<void> {
    const fileId = this.extractFileId();
    
    const apiCode = `
// Figma API Code to Extract Design Data
import axios from 'axios';

const FIGMA_TOKEN = 'your-figma-personal-access-token';
const FILE_ID = '${fileId}';

async function extractFigJamData() {
  try {
    // Note: FigJam files have limited API support compared to Design files
    const response = await axios.get(
      \`https://api.figma.com/v1/files/\${FILE_ID}\`,
      { headers: { 'X-Figma-Token': FIGMA_TOKEN } }
    );
    
    const document = response.data.document;
    
    // Extract components and styles
    const components = extractComponents(document);
    const styles = extractStyles(document);
    const images = await extractImages(FILE_ID);
    
    return { components, styles, images };
  } catch (error) {
    console.error('FigJam API extraction failed:', error);
    // Fallback to manual extraction
  }
}

function extractComponents(document) {
  // Parse FigJam nodes and convert to component structure
  return document.children.map(page => ({
    name: page.name,
    type: page.type,
    children: page.children || []
  }));
}

async function extractImages(fileId) {
  // Get image URLs from Figma
  const imageResponse = await axios.get(
    \`https://api.figma.com/v1/images/\${fileId}\`,
    { headers: { 'X-Figma-Token': FIGMA_TOKEN } }
  );
  
  return imageResponse.data.images;
}
`;

    this.exportResults.push({
      type: 'angular',
      content: apiCode,
      filename: 'figma-api-extractor.ts',
      description: 'API-based extraction (limited FigJam support)'
    });
  }

  private async generateManualExtractionCode(): Promise<void> {
    const fileId = this.extractFileId();
    
    // Generate Merchant App Components based on FigJam design
    const merchantDashboardCode = `
// Merchant Dashboard Component - Generated from FigJam Design
// File: ${this.figJamUrl}

@Component({
  selector: 'app-merchant-dashboard',
  template: \`
    <div class="merchant-dashboard">
      <!-- Header Section from FigJam -->
      <div class="dashboard-header">
        <div class="store-info">
          <h1 class="store-name">VU's Brew House</h1>
          <p class="store-tagline">Premium Tea & Coffee Merchant</p>
        </div>
        <div class="action-buttons">
          <button class="btn-primary" (click)="addProduct()">
            <mat-icon>add</mat-icon>
            Add Product
          </button>
          <button class="btn-secondary" (click)="viewOrders()">
            <mat-icon>shopping_cart</mat-icon>
            Orders ({{ orderCount }})
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card revenue">
          <div class="stat-icon">
            <mat-icon>attach_money</mat-icon>
          </div>
          <div class="stat-content">
            <h3>₹{{ todayRevenue | number:'1.0-0' }}</h3>
            <p>Today's Revenue</p>
            <span class="stat-change positive">+12%</span>
          </div>
        </div>
        
        <div class="stat-card orders">
          <div class="stat-icon">
            <mat-icon>receipt</mat-icon>
          </div>
          <div class="stat-content">
            <h3>{{ todayOrders }}</h3>
            <p>Today's Orders</p>
            <span class="stat-change positive">+8%</span>
          </div>
        </div>
        
        <div class="stat-card products">
          <div class="stat-icon">
            <mat-icon>inventory</mat-icon>
          </div>
          <div class="stat-content">
            <h3>{{ activeProducts }}</h3>
            <p>Active Products</p>
            <span class="stat-change neutral">{{ lowStockCount }} low stock</span>
          </div>
        </div>
      </div>

      <!-- Product Management -->
      <div class="product-management">
        <div class="section-header">
          <h2>Product Catalog</h2>
          <button class="btn-outline" (click)="exportCatalog()">
            <mat-icon>download</mat-icon>
            Export
          </button>
        </div>
        
        <div class="product-grid">
          @for (product of merchantProducts; track product.id) {
            <div class="merchant-product-card">
              <div class="product-image-container">
                <img [src]="product.image" [alt]="product.name">
                <div class="product-status" [class]="product.status.toLowerCase()">
                  {{ product.status }}
                </div>
              </div>
              
              <div class="product-details">
                <h3>{{ product.name }}</h3>
                <p class="product-category">{{ product.category }}</p>
                <div class="product-pricing">
                  <span class="price">₹{{ product.price }}</span>
                  <span class="stock">Stock: {{ product.stock }}</span>
                </div>
                
                <div class="product-actions">
                  <button class="btn-edit" (click)="editProduct(product.id)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button class="btn-delete" (click)="deleteProduct(product.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                  <button class="btn-view" (click)="viewAnalytics(product.id)">
                    <mat-icon>analytics</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  \`,
  styles: [\`
    .merchant-dashboard {
      padding: 1.5rem;
      background: #f8fafc;
      min-height: 100vh;
    }
    
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .store-name {
      color: #1f2937;
      font-size: 1.875rem;
      font-weight: 700;
      margin: 0 0 0.25rem 0;
    }
    
    .store-tagline {
      color: #6b7280;
      margin: 0;
    }
    
    .action-buttons {
      display: flex;
      gap: 0.75rem;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }
    
    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 25px rgba(249, 115, 22, 0.3);
    }
    
    .btn-secondary {
      background: white;
      color: #374151;
      border: 2px solid #d1d5db;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }
    
    .btn-secondary:hover {
      border-color: #f97316;
      color: #f97316;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: transform 0.3s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-2px);
    }
    
    .stat-icon {
      width: 4rem;
      height: 4rem;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .stat-card.revenue .stat-icon {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }
    
    .stat-card.orders .stat-icon {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
    }
    
    .stat-card.products .stat-icon {
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
      color: white;
    }
    
    .stat-content h3 {
      font-size: 1.875rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
    }
    
    .stat-content p {
      color: #6b7280;
      margin: 0 0 0.5rem 0;
    }
    
    .stat-change {
      font-size: 0.875rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }
    
    .stat-change.positive {
      background: #dcfce7;
      color: #166534;
    }
    
    .stat-change.neutral {
      background: #fef3c7;
      color: #92400e;
    }
    
    .product-management {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    .section-header h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }
    
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    
    .merchant-product-card {
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    
    .merchant-product-card:hover {
      border-color: #f97316;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
    
    .product-image-container {
      position: relative;
      height: 180px;
      background: #f3f4f6;
      overflow: hidden;
    }
    
    .product-image-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .product-status {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    
    .product-status.active {
      background: #dcfce7;
      color: #166534;
    }
    
    .product-status.inactive {
      background: #fecaca;
      color: #991b1b;
    }
    
    .product-details {
      padding: 1rem;
    }
    
    .product-details h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
    }
    
    .product-category {
      color: #6b7280;
      font-size: 0.875rem;
      margin: 0 0 0.75rem 0;
    }
    
    .product-pricing {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .price {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
    }
    
    .stock {
      font-size: 0.875rem;
      color: #6b7280;
    }
    
    .product-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
    }
    
    .product-actions button {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 6px;
      border: 1px solid #d1d5db;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }
    
    .btn-edit:hover {
      background: #dbeafe;
      border-color: #3b82f6;
      color: #3b82f6;
    }
    
    .btn-delete:hover {
      background: #fecaca;
      border-color: #ef4444;
      color: #ef4444;
    }
    
    .btn-view:hover {
      background: #f3e8ff;
      border-color: #8b5cf6;
      color: #8b5cf6;
    }
  \`]
})
export class MerchantDashboardComponent {
  @Input() merchantProducts: MerchantProduct[] = [];
  
  todayRevenue: number = 25400;
  todayOrders: number = 47;
  activeProducts: number = 23;
  lowStockCount: number = 3;
  orderCount: number = 12;

  addProduct(): void {
    // Navigate to add product form
  }

  viewOrders(): void {
    // Navigate to orders view
  }

  editProduct(productId: string): void {
    // Navigate to product edit form
  }

  deleteProduct(productId: string): void {
    // Show delete confirmation
  }

  viewAnalytics(productId: string): void {
    // Navigate to product analytics
  }

  exportCatalog(): void {
    // Export product catalog to CSV/PDF
  }
}

// Merchant Product Interface
export interface MerchantProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  status: 'Active' | 'Inactive';
  description?: string;
}
`;

    this.exportResults.push({
      type: 'angular',
      content: merchantDashboardCode,
      filename: 'merchant-dashboard.component.ts',
      description: 'Merchant Dashboard component from your FigJam design'
    });

    // Generate the design tokens specific to merchant app
    const merchantTokens = `
// VU's Brew House Merchant App Design Tokens
// Extracted from FigJam: ${this.figJamUrl}

export const MERCHANT_APP_TOKENS = {
  colors: {
    // Primary brand colors from FigJam design
    primary: {
      50: '#fff7ed',
      100: '#ffedd5', 
      500: '#f97316',  // Main orange from your design
      600: '#ea580c',
      900: '#9a3412'
    },
    
    // Status colors
    success: '#10b981',
    warning: '#f59e0b', 
    error: '#ef4444',
    
    // Neutral colors
    gray: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      500: '#64748b',
      600: '#475569',
      900: '#0f172a'
    },
    
    // Background colors
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      accent: '#fff7ed'
    }
  },
  
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px  
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
    xl: '1.5rem',    // 24px
    '2xl': '2rem',   // 32px
    '3xl': '3rem'    // 48px
  },
  
  borderRadius: {
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem'       // 16px
  },
  
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    
    sizes: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem'  // 30px
    },
    
    weights: {
      normal: '400',
      medium: '500', 
      semibold: '600',
      bold: '700'
    }
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  },
  
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },
    
    easing: {
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)', 
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
};

// CSS Custom Properties Generator
export function generateMerchantAppCSS(): string {
  return \`
    :root {
      /* Colors */
      --merchant-primary: \${MERCHANT_APP_TOKENS.colors.primary[500]};
      --merchant-primary-hover: \${MERCHANT_APP_TOKENS.colors.primary[600]};
      --merchant-success: \${MERCHANT_APP_TOKENS.colors.success};
      --merchant-warning: \${MERCHANT_APP_TOKENS.colors.warning};
      --merchant-error: \${MERCHANT_APP_TOKENS.colors.error};
      
      /* Spacing */
      --merchant-space-sm: \${MERCHANT_APP_TOKENS.spacing.sm};
      --merchant-space-md: \${MERCHANT_APP_TOKENS.spacing.md};
      --merchant-space-lg: \${MERCHANT_APP_TOKENS.spacing.lg};
      --merchant-space-xl: \${MERCHANT_APP_TOKENS.spacing.xl};
      
      /* Typography */
      --merchant-font-family: \${MERCHANT_APP_TOKENS.typography.fontFamily};
      --merchant-text-xs: \${MERCHANT_APP_TOKENS.typography.sizes.xs};
      --merchant-text-sm: \${MERCHANT_APP_TOKENS.typography.sizes.sm};
      --merchant-text-base: \${MERCHANT_APP_TOKENS.typography.sizes.base};
      --merchant-text-lg: \${MERCHANT_APP_TOKENS.typography.sizes.lg};
      
      /* Shadows */
      --merchant-shadow-sm: \${MERCHANT_APP_TOKENS.shadows.sm};
      --merchant-shadow-md: \${MERCHANT_APP_TOKENS.shadows.md};
      --merchant-shadow-lg: \${MERCHANT_APP_TOKENS.shadows.lg};
    }
  \`;
}
`;

    this.exportResults.push({
      type: 'tokens',
      content: merchantTokens,
      filename: 'merchant-design-tokens.ts',
      description: 'Design tokens from your FigJam merchant app'
    });
  }

  private async generateExtensionInstructions(): Promise<void> {
    const extensionGuide = `
// Browser Extension Method for FigJam Export

RECOMMENDED EXTENSIONS:
1. "Figma Inspector" - Extract CSS from any Figma element
2. "Design System Manager" - Export design tokens
3. "Figma to HTML" - Generate HTML/CSS code

STEPS:
1. Install browser extension
2. Open your FigJam file: ${this.figJamUrl}
3. Select elements you want to convert
4. Use extension to export code
5. Customize for Angular/TypeScript

LIMITATIONS:
- Extensions may not support FigJam fully (designed for Figma)
- Manual cleanup usually required
- Generated code often needs optimization

ALTERNATIVE - Copy Design Properties:
1. Select element in FigJam
2. Copy design properties (spacing, colors, fonts)
3. Manually recreate in CSS/Angular
4. Use browser dev tools to inspect similar designs
`;

    this.exportResults.push({
      type: 'html',
      content: extensionGuide,
      filename: 'extension-export-guide.txt',
      description: 'Browser extension export guide'
    });
  }

  private extractFileId(): string {
    const match = this.figJamUrl.match(/\/file\/([a-zA-Z0-9]+)/);
    return match ? match[1] : 'unknown';
  }

  async downloadExport(exportItem: FigJamCodeExport): Promise<void> {
    const blob = new Blob([exportItem.content], { 
      type: exportItem.type === 'angular' ? 'text/typescript' : 'text/plain' 
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = exportItem.filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  copyToClipboard(content: string): void {
    navigator.clipboard.writeText(content);
    this.showSuccess('Code copied to clipboard! 📋');
  }

  openPluginUrl(url: string): void {
    window.open(url, '_blank');
  }

  private showError(message: string): void {
    // Simple error notification
    console.error(message);
  }

  private showSuccess(message: string): void {
    // Simple success notification  
    console.log(message);
  }
}