import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  template: `
    <nav class="main-navigation">
      <div class="nav-container">
        <!-- Brand -->
        <div class="brand" [routerLink]="['/catalog']">
          <mat-icon class="brand-icon">local_cafe</mat-icon>
          <span class="brand-text">VU's Brew House</span>
        </div>

        <!-- Navigation Links -->
        <div class="nav-links">
          <button 
            mat-button 
            class="nav-link"
            [routerLink]="['/catalog']"
            routerLinkActive="active">
            <mat-icon>storefront</mat-icon>
            Catalog
          </button>

          <button 
            mat-button 
            class="nav-link merchant-link"
            [routerLink]="['/merchant/dashboard']"
            routerLinkActive="active">
            <mat-icon>dashboard</mat-icon>
            Merchant Dashboard
          </button>

          <!-- FigJam Tools for Enhancement -->
          <button mat-button [matMenuTriggerFor]="enhanceMenu" class="nav-link enhance-menu">
            <mat-icon>design_services</mat-icon>
            Enhance
            <mat-icon>expand_more</mat-icon>
          </button>
          
          <mat-menu #enhanceMenu="matMenu">
            <button mat-menu-item [routerLink]="['/merchant/design-tools']">
              <mat-icon>code</mat-icon>
              FigJam Code Export
            </button>
          </mat-menu>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .main-navigation {
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border-bottom: 2px solid #e2e8f0;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      position: sticky;
      top: 0;
      z-index: 1000;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 4rem;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      padding: 0.5rem 1rem;
      border-radius: 12px;
      transition: all 0.3s ease;
      text-decoration: none;
      color: inherit;
    }

    .brand:hover {
      background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
      transform: translateY(-1px);
    }

    .brand-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: #f97316;
    }

    .brand-text {
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      transition: all 0.3s ease;
      color: #6b7280;
      font-weight: 500;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 0.875rem;
      min-height: 44px;
    }

    .nav-link:hover {
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      color: #374151;
      transform: translateY(-1px);
    }

    .nav-link.active {
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
      color: white;
      font-weight: 600;
    }

    .nav-link.active:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
    }

    .nav-link.merchant-link {
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
      color: white;
      font-weight: 600;
      margin-left: 0.5rem;
    }

    .nav-link.merchant-link:hover {
      background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
    }

    .nav-link.merchant-link mat-icon {
      color: #fbbf24;
    }

    .nav-link mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .tools-menu {
      position: relative;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .nav-container {
        gap: 1rem;
        padding: 0 1rem;
      }

      .brand-text {
        display: none;
      }

      .nav-links {
        gap: 0.25rem;
      }

      .nav-link {
        padding: 0.5rem;
        min-width: 44px;
        justify-content: center;
      }

      .nav-link span {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .nav-container {
        height: 3.5rem;
      }

      .nav-links {
        gap: 0.125rem;
      }

      .nav-link {
        padding: 0.375rem;
        min-width: 40px;
      }

      .nav-link mat-icon {
        font-size: 1.125rem;
        width: 1.125rem;
        height: 1.125rem;
      }
    }

    /* Animation for active state */
    .nav-link.active {
      position: relative;
      overflow: hidden;
    }

    .nav-link.active::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      animation: shine 2s ease-in-out infinite;
    }

    @keyframes shine {
      0% { left: -100%; }
      50% { left: 100%; }
      100% { left: 100%; }
    }

    /* Menu styling */
    ::ng-deep .mat-mdc-menu-panel {
      border-radius: 12px !important;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
      border: 1px solid #e2e8f0 !important;
      overflow: hidden !important;
    }

    ::ng-deep .mat-mdc-menu-item {
      display: flex !important;
      align-items: center !important;
      gap: 0.75rem !important;
      padding: 0.75rem 1rem !important;
      transition: all 0.2s ease !important;
    }

    ::ng-deep .mat-mdc-menu-item:hover {
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%) !important;
      color: white !important;
    }

    ::ng-deep .mat-mdc-menu-item mat-icon {
      color: #6b7280 !important;
      margin-right: 0 !important;
    }

    ::ng-deep .mat-mdc-menu-item:hover mat-icon {
      color: white !important;
    }
  `]
})
export class NavigationComponent {
  constructor(private router: Router) {}
}