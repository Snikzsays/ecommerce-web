import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div class="max-w-4xl w-full">
        <!-- Header -->
        <div class="text-center mb-12">
          <div class="flex items-center justify-center gap-3 mb-6">
            <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
              <mat-icon class="text-white text-3xl">local_cafe</mat-icon>
            </div>
            <div>
              <h1 class="text-4xl font-bold text-gray-900">VU's Brew House</h1>
              <p class="text-lg text-gray-600">Premium Tea & Coffee Experience</p>
            </div>
          </div>
          <p class="text-xl text-gray-700 max-w-2xl mx-auto">
            Welcome to our unified platform. Choose your experience below.
          </p>
        </div>

        <!-- Mode Selection Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Customer Mode -->
          <mat-card class="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="p-8 text-center bg-gradient-to-b from-green-50 to-emerald-100">
              <mat-icon class="text-6xl text-green-600 mb-4">storefront</mat-icon>
              <h2 class="text-2xl font-bold text-gray-900 mb-3">Shop Our Catalog</h2>
              <p class="text-gray-600 mb-6 leading-relaxed">
                Browse our premium collection of teas and coffees. Discover new flavors and place orders seamlessly.
              </p>
              <div class="space-y-3 mb-6">
                <div class="flex items-center gap-2 text-sm text-gray-700">
                  <mat-icon class="text-green-600 text-lg">check_circle</mat-icon>
                  <span>Premium Tea & Coffee Collection</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-700">
                  <mat-icon class="text-green-600 text-lg">check_circle</mat-icon>
                  <span>Easy Online Ordering</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-700">
                  <mat-icon class="text-green-600 text-lg">check_circle</mat-icon>
                  <span>Fast Delivery Service</span>
                </div>
              </div>
              <button 
                mat-raised-button 
                color="primary"
                routerLink="/customer/catalog"
                class="w-full py-3 text-lg font-semibold">
                <mat-icon class="mr-2">shopping_bag</mat-icon>
                Start Shopping
              </button>
            </div>
          </mat-card>

          <!-- Merchant Mode -->
          <mat-card class="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="p-8 text-center bg-gradient-to-b from-blue-50 to-indigo-100">
              <mat-icon class="text-6xl text-blue-600 mb-4">dashboard</mat-icon>
              <h2 class="text-2xl font-bold text-gray-900 mb-3">Merchant Dashboard</h2>
              <p class="text-gray-600 mb-6 leading-relaxed">
                Manage your inventory, track sales, and grow your business with our comprehensive merchant tools.
              </p>
              <div class="space-y-3 mb-6">
                <div class="flex items-center gap-2 text-sm text-gray-700">
                  <mat-icon class="text-blue-600 text-lg">check_circle</mat-icon>
                  <span>Inventory Management</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-700">
                  <mat-icon class="text-blue-600 text-lg">check_circle</mat-icon>
                  <span>Sales Analytics</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-700">
                  <mat-icon class="text-blue-600 text-lg">check_circle</mat-icon>
                  <span>Order Management</span>
                </div>
              </div>
              <button 
                mat-raised-button 
                color="primary"
                routerLink="/merchant/dashboard"
                class="w-full py-3 text-lg font-semibold">
                <mat-icon class="mr-2">business</mat-icon>
                Access Dashboard
              </button>
            </div>
          </mat-card>
        </div>

        <!-- Footer -->
        <div class="text-center mt-12">
          <p class="text-gray-500 text-sm">
            © 2026 VU's Brew House. One platform, two powerful experiences.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mat-mdc-raised-button {
      --mdc-protected-button-container-color: #f59e0b;
      --mdc-protected-button-label-text-color: white;
    }
    
    .mat-mdc-raised-button:hover {
      --mdc-protected-button-container-color: #d97706;
    }

    mat-card {
      border-radius: 16px;
      border: 1px solid #e5e7eb;
    }

    mat-card:hover {
      border-color: #d1d5db;
    }
  `]
})
export class HomeComponent {}