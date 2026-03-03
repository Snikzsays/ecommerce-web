import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../models/store.model';

export interface ProductQuickViewData {
  product: Product;
  imageUrl: string;
  cartQuantity: number;
}

@Component({
  selector: 'app-product-quick-view-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="pqv-root">
      <header class="pqv-header">
        <div class="pqv-title">
          <h2>{{ data.product.name }}</h2>
          <p class="pqv-subtitle" *ngIf="data.product.nameHindi">{{ data.product.nameHindi }}</p>
          <p class="pqv-price">
            {{ primaryVariant.discountedPrice | currency:'INR':'symbol-narrow' }}
            <span class="pqv-mrp" *ngIf="primaryVariant.mrp && primaryVariant.mrp !== primaryVariant.discountedPrice">
              MRP {{ primaryVariant.mrp | currency:'INR':'symbol-narrow' }}
            </span>
            <span class="pqv-size">• {{ primaryVariant.size }}</span>
          </p>
        </div>

        <button mat-icon-button (click)="close()" aria-label="Close product quick view">
          <mat-icon>close</mat-icon>
        </button>
      </header>

      <main class="pqv-content">
        <section class="pqv-media">
          <img
            [src]="data.imageUrl"
            [alt]="data.product.name"
            (error)="onImageError($event)"
          />
        </section>

        <section class="pqv-details">
          <h3>About this product</h3>
          <p class="pqv-description">
            Premium {{ data.product.subCategory }} from our {{ data.product.category | titlecase }} range.
            Perfect for customers who appreciate quality and consistent flavour.
          </p>

          <div class="pqv-actions">
            <button mat-raised-button color="primary">
              Add to cart
              <span *ngIf="data.cartQuantity">(in cart: {{ data.cartQuantity }})</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .pqv-root {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100vw;
      box-sizing: border-box;
      background: #f9fafb;
      color: #0f172a;
      transform: translateY(100%);
      animation: pqv-slide-up 260ms ease-out forwards;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    @keyframes pqv-slide-up {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }

    .pqv-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      background: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      box-shadow: 0 4px 10px rgba(15, 23, 42, 0.06);
      z-index: 1;
    }

    .pqv-title h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .pqv-subtitle {
      margin: 0.15rem 0 0;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .pqv-price {
      margin: 0.4rem 0 0;
      font-weight: 600;
      color: #16a34a;
      font-size: 0.95rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      align-items: baseline;
    }

    .pqv-mrp {
      font-weight: 500;
      color: #9ca3af;
      text-decoration: line-through;
    }

    .pqv-size {
      color: #4b5563;
      font-weight: 500;
    }

    .pqv-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 1rem 1.5rem 1.5rem;
      gap: 1rem;
      overflow-y: auto;
    }

    .pqv-media img {
      width: 100%;
      max-height: 320px;
      object-fit: cover;
      border-radius: 0.75rem;
      box-shadow: 0 20px 35px rgba(15, 23, 42, 0.25);
      background: #e5e7eb;
    }

    .pqv-details {
      padding-top: 0.5rem;
    }

    .pqv-details h3 {
      margin: 0 0 0.5rem;
      font-size: 1rem;
      font-weight: 600;
    }

    .pqv-description {
      margin: 0 0 1.25rem;
      color: #4b5563;
      line-height: 1.6;
      font-size: 0.95rem;
    }

    .pqv-actions button {
      min-width: 160px;
    }

    @media (min-width: 768px) {
      .pqv-content {
        flex-direction: row;
      }

      .pqv-media,
      .pqv-details {
        flex: 1;
      }

      .pqv-media {
        max-width: 50%;
      }
    }
  `]
})
export class ProductQuickViewDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ProductQuickViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductQuickViewData
  ) {}

  get primaryVariant() {
    return this.data.product.variants[0];
  }

  close(): void {
    this.dialogRef.close();
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop&auto=format';
  }
}
