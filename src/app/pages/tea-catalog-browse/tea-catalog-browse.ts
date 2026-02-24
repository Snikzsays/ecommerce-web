import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreHeaderComponent } from '../../components/store-header/store-header';

type TeaProduct = {
  id: string;
  name: string;
  nameHindi: string;
  category: string;
  price: number;
  originalPrice?: number;
  badge?: 'bestseller' | 'merchant-pick' | 'fresh-stock' | 'popular';
  sizes: string[];
  caffeine: 'high' | 'medium' | 'low' | 'none';
  inStock: boolean;
  ordersLast48h?: number;
};

@Component({
  selector: 'app-tea-catalog-browse',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, StoreHeaderComponent],
  templateUrl: './tea-catalog-browse.html',
  styleUrl: './tea-catalog-browse.scss',
})
export class TeaCatalogBrowse {
  storeName = "VU's Brew House";
  storeTagline = 'Premium Teas • Mumbai';
  searchQuery = '';
  selectedCategory = 'all';
  showFilters = false;

  favorites: string[] = [];
  selectedSizes: Record<string, string> = {};

  // UI-only demo cart state (later replace with real cart service/API)
  cart: Array<{ productId: string; size: string; qty: number }> = [];

  products: TeaProduct[] = [
    {
      id: '1',
      name: 'Kashmiri Kawa',
      nameHindi: 'कश्मीरी कहवा',
      category: 'Green Tea',
      price: 375,
      originalPrice: 450,
      badge: 'bestseller',
      sizes: ['100g', '250g'],
      caffeine: 'low',
      inStock: true,
      ordersLast48h: 24,
    },
    {
      id: '2',
      name: 'Assam Premium CTC',
      nameHindi: 'असम प्रीमियम चाय',
      category: 'Black Tea',
      price: 420,
      badge: 'merchant-pick',
      sizes: ['250g', '500g', '1kg'],
      caffeine: 'high',
      inStock: true,
    },
    {
      id: '3',
      name: 'Masala Chai Premix',
      nameHindi: 'मसाला चाय प्रीमिक्स',
      category: 'Premix',
      price: 450,
      badge: 'popular',
      sizes: ['500g', '1kg'],
      caffeine: 'medium',
      inStock: true,
      ordersLast48h: 18,
    },
    {
      id: '4',
      name: 'Mint Green Tea',
      nameHindi: 'पुदीना हरी चाय',
      category: 'Green Tea',
      price: 300,
      originalPrice: 350,
      badge: 'fresh-stock',
      sizes: ['100g', '250g'],
      caffeine: 'low',
      inStock: true,
    },
    {
      id: '5',
      name: 'Lemon Ice Tea',
      nameHindi: 'नींबू आइस टी',
      category: 'Ice Tea',
      price: 413,
      sizes: ['1kg'],
      caffeine: 'low',
      inStock: true,
    },
    {
      id: '6',
      name: 'Cardamom Tea',
      nameHindi: 'इलायची चाय',
      category: 'Premix',
      price: 413,
      badge: 'merchant-pick',
      sizes: ['1kg'],
      caffeine: 'medium',
      inStock: true,
    },
  ];

  categories = [
    { id: 'all', name: 'All Teas', nameHindi: 'सभी चाय' },
    { id: 'black', name: 'Black Tea', nameHindi: 'ब्लैक टी' },
    { id: 'green', name: 'Green Tea', nameHindi: 'ग्रीन टी' },
    { id: 'premix', name: 'Premix', nameHindi: 'प्रीमिक्स' },
    { id: 'ice-tea', name: 'Ice Tea', nameHindi: 'आइस टी' },
  ];

  private categoryMatches(p: TeaProduct): boolean {
    if (this.selectedCategory === 'all') return true;

    const map: Record<string, string> = {
      black: 'Black Tea',
      green: 'Green Tea',
      premix: 'Premix',
      'ice-tea': 'Ice Tea',
    };

    return p.category === map[this.selectedCategory];
  }

  get filteredProducts(): TeaProduct[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.products.filter((p) => {
      const matchCategory = this.categoryMatches(p);
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.nameHindi.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }

  getBadgeInfo(badge?: TeaProduct['badge']): { bg: string; text: string; icon: string } | null {
    switch (badge) {
      case 'bestseller':
        return { bg: 'bg-orange-600', text: 'Best Seller', icon: 'trending_up' };
      case 'merchant-pick':
        return { bg: 'bg-purple-600', text: 'Our Pick', icon: 'star' };
      case 'fresh-stock':
        return { bg: 'bg-green-600', text: 'Fresh Stock', icon: 'auto_awesome' };
      case 'popular':
        return { bg: 'bg-blue-600', text: 'Popular', icon: 'star' };
      default:
        return null;
    }
  }

  toggleFavorite(productId: string): void {
    this.favorites = this.favorites.includes(productId)
      ? this.favorites.filter((id) => id !== productId)
      : [...this.favorites, productId];
  }

  isFavorite(productId: string): boolean {
    return this.favorites.includes(productId);
  }

  selectSize(productId: string, size: string): void {
    this.selectedSizes = { ...this.selectedSizes, [productId]: size };
  }

  discountPercent(p: TeaProduct): number {
    if (!p.originalPrice) return 0;
    return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
  }

  // UI demo cart logic (replace later)
  getCartQuantity(productId: string, size: string): number {
    const item = this.cart.find((x) => x.productId === productId && x.size === size);
    return item?.qty ?? 0;
  }

  addToCart(productId: string, size: string): void {
    const idx = this.cart.findIndex((x) => x.productId === productId && x.size === size);
    if (idx >= 0) this.cart[idx] = { ...this.cart[idx], qty: this.cart[idx].qty + 1 };
    else this.cart = [...this.cart, { productId, size, qty: 1 }];
  }

  removeFromCart(productId: string, size: string): void {
    const idx = this.cart.findIndex((x) => x.productId === productId && x.size === size);
    if (idx < 0) return;

    const item = this.cart[idx];
    if (item.qty <= 1) this.cart = this.cart.filter((_, i) => i !== idx);
    else this.cart[idx] = { ...item, qty: item.qty - 1 };
  }

  // placeholder click (later route to detail page)
  onProductClick(productId: string): void {
    console.log('product click:', productId);
  }
}