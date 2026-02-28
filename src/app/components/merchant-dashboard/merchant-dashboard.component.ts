import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { MerchantService, MerchantProduct } from '../../services/merchant.service';

@Component({
  selector: 'app-merchant-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule
  ],
  template: `
    <div class="merchant-dashboard min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white shadow-sm border-b p-6">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">VU's Brew House Dashboard</h1>
            <p class="text-gray-600 mt-1">Manage your products and track performance</p>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-500">{{ getCurrentDate() }}</span>
            <button 
              mat-raised-button 
              color="primary"
              (click)="addProduct()"
              class="flex items-center gap-2">
              <mat-icon>add</mat-icon>
              Add Product
            </button>
            <button 
              mat-raised-button 
              color="accent"
              routerLink="/merchant/design-tools"
              class="flex items-center gap-2">
              <mat-icon>design_services</mat-icon>
              FigJam Tools
            </button>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto p-6">
        <!-- Statistics Cards - exact match with FigJam React component -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <mat-card class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Today's Revenue</p>
                <p class="text-2xl font-bold text-gray-900">₹{{ todayRevenue() | number }}</p>
                <p class="text-xs text-green-600">+12.5% from yesterday</p>
              </div>
              <mat-icon class="text-green-600">trending_up</mat-icon>
            </div>
          </mat-card>

          <mat-card class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Today's Orders</p>
                <p class="text-2xl font-bold text-gray-900">{{ todayOrders() }}</p>
                <p class="text-xs text-blue-600">+8.2% from yesterday</p>
              </div>
              <mat-icon class="text-blue-600">shopping_cart</mat-icon>
            </div>
          </mat-card>

          <mat-card class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Active Products</p>
                <p class="text-2xl font-bold text-gray-900">{{ activeProducts() }}</p>
                <p class="text-xs text-purple-600">{{ merchantProducts().length }} total</p>
              </div>
              <mat-icon class="text-purple-600">inventory_2</mat-icon>
            </div>
          </mat-card>

          <mat-card class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Low Stock</p>
                <p class="text-2xl font-bold text-gray-900">{{ lowStockCount() }}</p>
                <p class="text-xs text-orange-600">Needs attention</p>
              </div>
              <mat-icon class="text-orange-600">warning</mat-icon>
            </div>
          </mat-card>
        </div>

        <!-- Product Grid - exact match with FigJam React component -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Product Catalog</h2>
            <button 
              mat-button 
              color="primary"
              (click)="exportCatalog()"
              class="flex items-center gap-2">
              <mat-icon>download</mat-icon>
              Export Catalog
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (product of merchantProducts(); track product.id) {
              <mat-card class="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200" 
                        (click)="viewProductDetails(product)">
                <img 
                  [src]="product.image || generatePlaceholderImage(product.name)" 
                  [alt]="product.name"
                  class="w-full h-48 object-cover"
                />
                <div class="p-4">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="font-semibold text-gray-900">{{ product.name }}</h3>
                    <span 
                      class="px-2 py-1 rounded-full text-xs"
                      [class.bg-green-100]="product.status === 'Active'"
                      [class.text-green-800]="product.status === 'Active'"
                      [class.bg-gray-100]="product.status !== 'Active'"
                      [class.text-gray-800]="product.status !== 'Active'">
                      {{ product.status }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 mb-2">{{ product.category }}</p>
                  <p class="text-lg font-bold text-gray-900 mb-2">₹{{ product.price | number }}</p>
                  <p class="text-sm mb-4"
                     [class.text-orange-600]="product.stock < 10"
                     [class.text-green-600]="product.stock >= 10">
                    Stock: {{ product.stock }} units
                  </p>
                  
                  <div class="flex gap-2" (click)="$event.stopPropagation()">
                    <button 
                      mat-button 
                      color="primary"
                      (click)="editProduct(product.id)"
                      class="flex-1">
                      Edit
                    </button>
                    <button 
                      mat-button
                      (click)="viewAnalytics(product.id)">
                      Analytics
                    </button>
                    <button 
                      mat-icon-button 
                      color="warn"
                      (click)="deleteProduct(product.id)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
              </mat-card>
            }
          </div>
        </div>
      </div>
    </div>

    <!-- Auto-sizable Product Details Modal -->
    @if (selectedProduct()) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" 
           (click)="closeProductDetails()">
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full auto-size-modal" 
             (click)="$event.stopPropagation()">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-6 border-b">
            <h2 class="text-2xl font-bold text-gray-900">{{ selectedProduct()?.name }}</h2>
            <button 
              mat-icon-button 
              (click)="closeProductDetails()"
              class="text-gray-500 hover:text-gray-700">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <!-- Modal Content - Auto-sizing -->
          <div class="p-6 max-h-[70vh] overflow-y-auto">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Product Image -->
              <div class="auto-fit-content">
                <img 
                  [src]="selectedProduct()?.image || generatePlaceholderImage(selectedProduct()?.name || '')" 
                  [alt]="selectedProduct()?.name"
                  class="w-full h-auto max-h-96 object-contain rounded-lg shadow-md"
                />
              </div>

              <!-- Product Details -->
              <div class="auto-fit-content">
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-lg font-semibold text-gray-700">Price:</span>
                    <span class="text-2xl font-bold text-green-600">₹{{ selectedProduct()?.price | number }}</span>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <span class="text-lg font-semibold text-gray-700">Category:</span>
                    <span class="text-lg text-gray-900">{{ selectedProduct()?.category }}</span>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <span class="text-lg font-semibold text-gray-700">Stock:</span>
                    <span class="text-lg" 
                          [class.text-orange-600]="(selectedProduct()?.stock || 0) < 10"
                          [class.text-green-600]="(selectedProduct()?.stock || 0) >= 10">
                      {{ selectedProduct()?.stock }} units
                    </span>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <span class="text-lg font-semibold text-gray-700">Status:</span>
                    <span class="px-3 py-1 rounded-full text-sm font-medium"
                          [class.bg-green-100]="selectedProduct()?.status === 'Active'"
                          [class.text-green-800]="selectedProduct()?.status === 'Active'"
                          [class.bg-gray-100]="selectedProduct()?.status !== 'Active'"
                          [class.text-gray-800]="selectedProduct()?.status !== 'Active'">
                      {{ selectedProduct()?.status }}
                    </span>
                  </div>
                  
                  <div>
                    <span class="text-lg font-semibold text-gray-700 block mb-2">Description:</span>
                    <p class="text-gray-600 leading-relaxed">{{ selectedProduct()?.description }}</p>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4 text-sm text-gray-500">
                    <div>
                      <span class="font-medium">Created:</span>
                      <p>{{ selectedProduct()?.createdAt | date:'medium' }}</p>
                    </div>
                    <div>
                      <span class="font-medium">Updated:</span>
                      <p>{{ selectedProduct()?.updatedAt | date:'medium' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
            <button 
              mat-button 
              (click)="closeProductDetails()"
              class="text-gray-600">
              Close
            </button>
            <button 
              mat-raised-button 
              color="primary"
              (click)="editProduct(selectedProduct()?.id || ''); closeProductDetails()"
              class="flex items-center gap-2">
              <mat-icon>edit</mat-icon>
              Edit Product
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styleUrls: ['./merchant-dashboard.component.css']
})
export class MerchantDashboardComponent implements OnInit {
  // React-style state management using signals - exact match with FigJam React component
  merchantProducts = signal<MerchantProduct[]>([]);
  
  // Exact values from FigJam React component
  todayRevenue = signal<number>(25400);
  todayOrders = signal<number>(47);
  activeProducts = signal<number>(23);
  lowStockCount = signal<number>(3);
  
  // Auto-sizable modal state
  selectedProduct = signal<MerchantProduct | null>(null);

  constructor(
    private merchantService: MerchantService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Load merchant products - simulating the exact data from FigJam React component
    const sampleProducts: MerchantProduct[] = [
      {
        id: '1',
        name: 'Premium Earl Grey',
        category: 'Tea',
        price: 299,
        stock: 12,
        image: 'https://images.unsplash.com/photo-1594631661960-0e6bd8e5a3c4?w=400&h=400&fit=crop',
        status: 'Active',
        description: 'Premium Earl Grey tea with bergamot oil',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Organic Green Tea',
        category: 'Tea',
        price: 249,
        stock: 8,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop',
        status: 'Active',
        description: 'Organic green tea leaves',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Indian Coffee Blend',
        category: 'Coffee',
        price: 399,
        stock: 15,
        image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop',
        status: 'Active',
        description: 'Rich Indian coffee blend',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4',
        name: 'Chamomile Tea',
        category: 'Tea',
        price: 199,
        stock: 5,
        image: 'https://images.unsplash.com/photo-1597318050753-b3b2d6bb9a82?w=400&h=400&fit=crop',
        status: 'Active',
        description: 'Soothing chamomile tea',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    this.merchantProducts.set(sampleProducts);
    
    // Update active products count based on actual data
    this.activeProducts.set(sampleProducts.filter(p => p.status === 'Active').length);
    this.lowStockCount.set(sampleProducts.filter(p => p.stock < 10).length);
  }

  // Auto-sizable product detail methods
  viewProductDetails(product: MerchantProduct): void {
    this.selectedProduct.set(product);
  }

  closeProductDetails(): void {
    this.selectedProduct.set(null);
  }

  // React component methods - exact match with FigJam
  addProduct(): void {
    // Navigate to add product form - exact React functionality
    console.log('Navigate to add product form');
    // Could open a modal or navigate to form
  }

  viewOrders(): void {
    // Navigate to orders view - exact React functionality
    console.log('Navigate to orders view');
  }

  editProduct(productId: string): void {
    // Navigate to product edit form - exact React functionality
    console.log('Navigate to product edit form', productId);
  }

  deleteProduct(productId: string): void {
    // Show delete confirmation - exact React functionality
    if (confirm('Are you sure you want to delete this product?')) {
      // Optimistic removal (React pattern)
      this.merchantProducts.update(products => 
        products.filter(p => p.id !== productId)
      );
      
      console.log('Product deleted:', productId);
      
      // Update counts
      const updatedProducts = this.merchantProducts();
      this.activeProducts.set(updatedProducts.filter(p => p.status === 'Active').length);
      this.lowStockCount.set(updatedProducts.filter(p => p.stock < 10).length);
    }
  }

  viewAnalytics(productId: string): void {
    // Navigate to product analytics - exact React functionality
    console.log('Navigate to product analytics', productId);
  }

  exportCatalog(): void {
    // Export product catalog to CSV/PDF - exact React functionality
    console.log('Export product catalog to CSV/PDF');
    
    // Simulate export
    const products = this.merchantProducts();
    const csvContent = 'data:text/csv;charset=utf-8,' + 
      'Name,Category,Price,Stock,Status\\n' +
      products.map(p => `${p.name},${p.category},${p.price},${p.stock},${p.status}`).join('\\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'vu-brew-house-catalog.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // React-style helper methods
  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
  
  // Generate placeholder image (React pattern for fallbacks)
  generatePlaceholderImage(name: string): string {
    const firstLetter = name.charAt(0).toUpperCase();
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="60" font-family="Arial">${firstLetter}</text></svg>`;
  }
}