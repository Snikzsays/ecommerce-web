import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../models/store.model';
import { ProductsService } from '../../services/products.service';
import { ImageAssetsService } from '../../services/image-assets.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <!-- Header -->
      <header class="flex items-center px-4 py-3 bg-gradient-to-r from-orange-400 via-yellow-400 to-yellow-300 shadow-sm sticky top-0 z-20">
        <button
          type="button"
          (click)="goBack()"
          class="mr-3 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
          aria-label="Back to catalog"
        >
          <mat-icon class="text-gray-700">arrow_back</mat-icon>
        </button>
        <div>
          <p class="text-xs text-amber-700 font-semibold">Product details</p>
          <h1 class="text-base font-bold text-gray-900 line-clamp-1">{{ product?.name }}</h1>
        </div>
      </header>

      <ng-container *ngIf="product; else notFound">
        <main class="flex-1 overflow-y-auto">
          <!-- Hero image with discount badge -->
          <section class="relative bg-white pb-4">
            <img
              [src]="imageUrl"
              [alt]="product!.name"
              class="w-full h-64 object-cover"
              (error)="onImageError($event)"
            />

            <div
              *ngIf="discountPercent > 0"
              class="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
            >
              {{ discountPercent }}% OFF
            </div>
          </section>

          <!-- Main content -->
          <section class="px-4 pt-4 pb-24 space-y-5">
            <!-- Title, subtitle, price & size selector -->
            <div>
              <h2 class="text-xl font-bold text-gray-900 mb-1">{{ product!.name }}</h2>
              <p class="text-sm text-gray-500 mb-2" *ngIf="product!.nameHindi">{{ product!.nameHindi }}</p>

              <div class="flex items-baseline gap-2 mb-3">
                <span class="text-2xl font-bold text-gray-900">₹{{ selectedVariant.discountedPrice }}</span>
                <span
                  *ngIf="selectedVariant.mrp > selectedVariant.discountedPrice"
                  class="text-sm text-gray-400 line-through"
                >
                  ₹{{ selectedVariant.mrp }}
                </span>
              </div>

              <!-- Size selector -->
              <div class="flex flex-wrap gap-2 mt-1">
                <button
                  *ngFor="let v of product!.variants; index as i"
                  type="button"
                  (click)="selectedVariantIndex = i"
                  [class]="i === selectedVariantIndex ? 'bg-orange-600 text-white border-transparent' : 'bg-white text-gray-800 border-gray-200'"
                  class="px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm hover:bg-orange-50"
                >
                  {{ v.size }}
                </button>
              </div>
            </div>

            <!-- Description -->
            <section>
              <h3 class="text-sm font-semibold text-gray-900 mb-1">Description</h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                {{ getDescription(product!) }}
              </p>
            </section>

            <!-- Ingredients as pills -->
            <section>
              <h3 class="text-sm font-semibold text-gray-900 mb-2">Ingredients</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  *ngFor="let ing of getIngredients(product!)"
                  class="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200"
                >
                  {{ ing }}
                </span>
              </div>
            </section>

            <!-- Delivery options -->
            <section>
              <h3 class="text-sm font-semibold text-gray-900 mb-2">Delivery options</h3>
              <div class="space-y-3">
                <div class="bg-blue-50 border border-blue-100 rounded-2xl p-4 shadow-sm">
                  <div class="flex items-center gap-2 text-blue-900 mb-1">
                    <mat-icon class="text-blue-600 text-base">local_shipping</mat-icon>
                    <p class="text-sm font-semibold">Home Delivery</p>
                  </div>
                  <p class="text-xs text-blue-900/80">Free delivery to Mumbai • Ships within 2 business days</p>
                </div>

                <div class="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 shadow-sm">
                  <div class="flex items-center gap-2 text-emerald-900 mb-1">
                    <mat-icon class="text-emerald-600 text-base">storefront</mat-icon>
                    <p class="text-sm font-semibold">Store Pickup</p>
                  </div>
                  <p class="text-xs text-emerald-900/80">Ready in 1-2 hours • Santacruz East, Mumbai</p>
                </div>

                <div class="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 shadow-sm flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <p class="text-sm font-semibold text-emerald-900">In Stock • Available Now</p>
                </div>
              </div>
            </section>
          </section>
        </main>

        <!-- Add to cart bar -->
        <footer class="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-[0_-4px_12px_rgba(15,23,42,0.08)] flex items-center justify-between gap-3">
          <div class="flex flex-col text-xs text-gray-600">
            <span>Selected size: <span class="font-semibold">{{ selectedVariant.size }}</span></span>
            <span>Price: <span class="font-semibold">₹{{ selectedVariant.discountedPrice }}</span></span>
          </div>
          <button
            mat-raised-button
            color="primary"
            class="!rounded-full px-6"
            (click)="addToCart()"
          >
            Add to Cart
          </button>
        </footer>
      </ng-container>

      <ng-template #notFound>
        <div class="flex-1 flex flex-col items-center justify-center text-center px-6">
          <p class="text-lg font-semibold text-gray-800 mb-1">Product not found</p>
          <p class="text-sm text-gray-600 mb-4">The product you are looking for is unavailable.</p>
          <button mat-raised-button color="primary" (click)="goBack()">Back to catalog</button>
        </div>
      </ng-template>
    </div>
  `,
})
export class ProductDetailsComponent {
  product?: Product;
  imageUrl = '';
  selectedVariantIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private imageAssetsService: ImageAssetsService,
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const prod = this.productsService.PRODUCTS.find(p => p.id === id);
      if (prod) {
        this.product = prod;
        this.imageUrl = this.imageAssetsService.getProductImage(id, 'main');
      }
    }
  }

  get selectedVariant() {
    return this.product!.variants[this.selectedVariantIndex];
  }

  get discountPercent(): number {
    if (!this.product) return 0;
    const v = this.selectedVariant;
    if (!v.mrp || v.mrp <= v.discountedPrice) return 0;
    return Math.round(((v.mrp - v.discountedPrice) / v.mrp) * 100);
  }

  goBack(): void {
    this.router.navigate(['/catalog']);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop&auto=format';
  }

  addToCart(): void {
    console.log('Add to cart from details', {
      productId: this.product?.id,
      variantIndex: this.selectedVariantIndex,
    });
  }

  getDescription(product: Product): string {
    switch (product.category) {
      case 'tea':
        return 'Premium tea blend crafted for rich aroma and balanced flavour, perfect for everyday brewing and special occasions.';
      case 'coffee':
        return 'Carefully roasted coffee delivering a smooth, full‑bodied cup with notes that pair beautifully with milk or enjoyed black.';
      case 'instant-mixes':
        return 'Instant mix designed for quick preparation without compromising on taste, ideal for cafés and busy counters.';
      case 'specialty':
        return 'Specialty product sourced from select origins, ideal as a premium add‑on or gifting option for your customers.';
      default:
        return 'High‑quality product from VU\'s Brew House, crafted to maintain consistent taste and freshness batch after batch.';
    }
  }

  getIngredients(product: Product): string[] {
    if (product.category === 'tea') {
      return ['CTC Tea Leaves', 'Natural Flavours', 'Aromatic Spices'];
    }
    if (product.category === 'coffee') {
      return ['Roasted Coffee Beans', 'Arabica & Robusta Blend'];
    }
    if (product.category === 'instant-mixes') {
      return ['Milk Solids', 'Sugar', 'Tea/Coffee Extract', 'Natural Flavours'];
    }
    if (product.category === 'specialty') {
      return ['Single‑origin Ingredient', 'Premium Grade Selection'];
    }
    return ['High‑quality Ingredients'];
  }
}
