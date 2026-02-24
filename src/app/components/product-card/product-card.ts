import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Product, ProductVariant } from '../../models/store.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() imageUrl: string = '';
  @Input() cartQuantity: number = 0;
  @Input() bulkOptions: Array<{ label: string; value: number }> = [];

  @Output() productClick = new EventEmitter<string>();
  @Output() addToCart = new EventEmitter<{ productId: string; variantIndex: number; bulkKg?: number }>();
  @Output() removeFromCart = new EventEmitter<{ productId: string; variantIndex: number; bulkKg?: number }>();

  bulkDropdownOpen = false;

  get variant(): ProductVariant {
    return this.product.variants[0];
  }

  get discountPercent(): number {
    return Math.round(((this.variant.mrp - this.variant.discountedPrice) / this.variant.mrp) * 100);
  }

  get hasBulkPrice(): boolean {
    return !!(this.variant.bulkPrice && this.variant.bulkMinQty);
  }

  onProductImageClick(): void {
    this.productClick.emit(this.product.id);
  }

  onAddClick(): void {
    this.addToCart.emit({ productId: this.product.id, variantIndex: 0 });
  }

  onRemoveClick(): void {
    this.removeFromCart.emit({ productId: this.product.id, variantIndex: 0 });
  }

  onAddQuantity(): void {
    this.addToCart.emit({ productId: this.product.id, variantIndex: 0 });
  }

  onBulkOrder(bulkKg: number): void {
    this.addToCart.emit({ productId: this.product.id, variantIndex: 0, bulkKg });
    this.bulkDropdownOpen = false;
  }

  toggleBulkDropdown(): void {
    this.bulkDropdownOpen = !this.bulkDropdownOpen;
  }

  closeBulkDropdown(): void {
    this.bulkDropdownOpen = false;
  }
}
