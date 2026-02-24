import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ProductsService } from '../../services/products.service';
import { Product, CartItem, NavigationStructure } from '../../models/store.model';
import { ProductCardComponent } from '../product-card/product-card';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, ProductCardComponent],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
})
export class CatalogComponent implements OnInit {
  currentView: 'home' | 'category' = 'home';
  selectedCategory: string = '';
  selectedSubCategory: string = 'All';
  searchQuery: string = '';
  bulkDropdownOpen: string | null = null;

  navigationStructure: NavigationStructure;
  products: Product[];
  cart: CartItem[] = [];
  scrollRefs: { [key: string]: HTMLDivElement | null } = {};

  storeName = "VU's Brew House";
  storeTagline = 'Premium Teas & Coffee • Mumbai';

  constructor(private productsService: ProductsService) {
    this.navigationStructure = this.productsService.NAVIGATION_STRUCTURE;
    this.products = this.productsService.PRODUCTS;
  }

  ngOnInit(): void {
    // Initialize
  }

  getTotalCartItems(): number {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  handleCategoryClick(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.selectedSubCategory = 'All';
    this.currentView = 'category';
  }

  handleHomeClick(): void {
    this.currentView = 'home';
    this.selectedCategory = '';
  }

  handleProductClick(productId: string): void {
    console.log('Product clicked:', productId);
    // Later: navigate to product detail page
  }

  handleCartClick(): void {
    console.log('Cart clicked');
    // Later: navigate to cart page
  }

  handleAddToCart(event: { productId: string; variantIndex: number; bulkKg?: number }): void {
    const existingItem = this.cart.find(
      (item) =>
        item.productId === event.productId &&
        item.variantIndex === event.variantIndex &&
        item.bulkKg === event.bulkKg
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        productId: event.productId,
        variantIndex: event.variantIndex,
        quantity: 1,
        bulkKg: event.bulkKg,
      });
    }
  }

  handleRemoveFromCart(event: { productId: string; variantIndex: number; bulkKg?: number }): void {
    const index = this.cart.findIndex(
      (item) =>
        item.productId === event.productId &&
        item.variantIndex === event.variantIndex &&
        item.bulkKg === event.bulkKg
    );

    if (index >= 0) {
      if (this.cart[index].quantity > 1) {
        this.cart[index].quantity -= 1;
      } else {
        this.cart.splice(index, 1);
      }
    }
  }

  getCartQuantity(productId: string, variantIndex: number, bulkKg?: number): number {
    const item = this.cart.find(
      (cartItem) =>
        cartItem.productId === productId &&
        cartItem.variantIndex === variantIndex &&
        cartItem.bulkKg === bulkKg
    );
    return item?.quantity ?? 0;
  }

  getProductsBySubCategory(categoryId: string): { [key: string]: Product[] } {
    const products = this.productsService.getProductsByCategory(categoryId);
    const category = this.navigationStructure.categories.find((c) => c.id === categoryId);

    if (!category) return {};

    const grouped: { [key: string]: Product[] } = {};
    category.subCategories.forEach((sub) => {
      if (sub === 'All') {
        grouped[sub] = products;
      } else {
        grouped[sub] = products.filter((p) => p.subCategory === sub);
      }
    });

    return grouped;
  }

  getProductsForSubCategory(categoryId: string, subCategory: string): Product[] {
    const subCats = this.getProductsBySubCategory(categoryId);
    return subCats[subCategory] || [];
  }

  getProductImage(product: Product): string {
    return this.productsService.getProductImage(product);
  }

  scrollLeft(subCategory: string): void {
    const ref = this.scrollRefs[subCategory];
    if (ref) {
      ref.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(subCategory: string): void {
    const ref = this.scrollRefs[subCategory];
    if (ref) {
      ref.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  setScrollRef(subCategory: string, ref: HTMLDivElement): void {
    this.scrollRefs[subCategory] = ref;
  }

  getProductCountByCategory(categoryId: string): number {
    return this.productsService.getProductsByCategory(categoryId).length;
  }

  getPopularProducts(): Product[] {
    return this.products
      .filter((p) => p.badge === 'Popular' || p.badge === 'Best Seller')
      .slice(0, 5);
  }

  get bulkOptions() {
    return this.productsService.BULK_OPTIONS;
  }
}
