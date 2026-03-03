import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { FigmaSyncService } from '../../services/figma-sync.service';
import { ImageAssetsService } from '../../services/image-assets.service';
import { Product, CartItem, NavigationStructure } from '../../models/store.model';
import { ProductCardComponent } from '../product-card/product-card';
import { AiChatBannerComponent } from '../ai-chat-banner/ai-chat-banner';
import { ProductQuickViewDialogComponent, ProductQuickViewData } from '../product-quick-view/product-quick-view-dialog.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatDialogModule, ProductCardComponent, AiChatBannerComponent],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
})
export class CatalogComponent implements OnInit {
  currentView: 'categories' | 'products' = 'categories';
  selectedCategory: string = '';
  selectedSubCategoryFilter: string = 'All';
  searchQuery: string = '';
  chatOpen: boolean = false;
  chatMessages: Array<{ text: string; sender: 'bot' | 'user' }> = [
    { text: 'Hi, how can I help you today?', sender: 'bot' }
  ];
  currentMessage: string = '';
  bulkDropdownOpen: string | null = null;
  filterOpen: boolean = false;
  selectedFilter: string | null = null;

  navigationStructure: NavigationStructure;
  products: Product[];
  cart: CartItem[] = [];
  scrollRefs: { [key: string]: HTMLDivElement | null } = {};
  @ViewChild('productScroller') productScrollerRef?: ElementRef<HTMLDivElement>;
  @ViewChild('teaScroller') teaScrollerRef?: ElementRef<HTMLDivElement>;
  @ViewChild('coffeeScroller') coffeeScrollerRef?: ElementRef<HTMLDivElement>;
  @ViewChild('instantMixesScroller') instantMixesScrollerRef?: ElementRef<HTMLDivElement>;
  @ViewChild('specialtyScroller') specialtyScrollerRef?: ElementRef<HTMLDivElement>;

  storeName = "VU's Brew House";
  storeTagline = 'Premium Teas & Coffee • Mumbai';

  constructor(
    private productsService: ProductsService,
    private figmaSyncService: FigmaSyncService,
    private imageAssetsService: ImageAssetsService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.navigationStructure = this.productsService.NAVIGATION_STRUCTURE;
    this.products = this.productsService.PRODUCTS;
  }

  ngOnInit(): void {
    // Initialize and apply Figma design tokens if available
    this.figmaSyncService.designTokens$.subscribe(tokens => {
      if (tokens) {
        this.figmaSyncService.applyDesignTokens(tokens);
      }
    });
  }

  getTotalCartItems(): number {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  handleCategoryClick(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.selectedSubCategoryFilter = 'All';
    this.currentView = 'products';
  }

  handleBack(): void {
    if (this.currentView === 'products') {
      this.currentView = 'categories';
      this.selectedCategory = '';
    }
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    
    // Dynamic cross-category search like in TSX
    if (query.trim()) {
      // Find which category has matching products
      const matchingProducts = this.products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.nameHindi?.includes(query) ||
        p.subCategory.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      );
      
      // If we find matches and user is in different category or no category
      if (matchingProducts.length > 0) {
        const firstMatchCategory = matchingProducts[0].category;
        // Auto-switch to the category with matches if not already there
        if (this.selectedCategory !== firstMatchCategory) {
          this.selectedCategory = firstMatchCategory;
          this.selectedSubCategoryFilter = 'All';
          this.currentView = 'products';
        } else if (this.currentView === 'categories') {
          // If on categories view, switch to products
          this.currentView = 'products';
        }
      }
    }
  }

  handleProductClick(productId: string): void {
    this.router.navigate(['/product', productId]);
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

  getTeaProducts(): Product[] {
    return this.productsService.getProductsByCategory('tea');
  }

  getCoffeeProducts(): Product[] {
    return this.productsService.getProductsByCategory('coffee');
  }

  getInstantMixProducts(): Product[] {
    return this.productsService.getProductsByCategory('instant-mixes');
  }

  getSpecialtyProducts(): Product[] {
    return this.productsService.getProductsByCategory('specialty');
  }

  scrollLeft(): void {
    const container = this.productScrollerRef?.nativeElement;
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    const container = this.productScrollerRef?.nativeElement;
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  scrollTeaLeft(): void {
    const container = this.teaScrollerRef?.nativeElement;
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollTeaRight(): void {
    const container = this.teaScrollerRef?.nativeElement;
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  scrollCoffeeLeft(): void {
    const container = this.coffeeScrollerRef?.nativeElement;
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollCoffeeRight(): void {
    const container = this.coffeeScrollerRef?.nativeElement;
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  scrollInstantMixesLeft(): void {
    const container = this.instantMixesScrollerRef?.nativeElement;
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollInstantMixesRight(): void {
    const container = this.instantMixesScrollerRef?.nativeElement;
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  scrollSpecialtyLeft(): void {
    const container = this.specialtyScrollerRef?.nativeElement;
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollSpecialtyRight(): void {
    const container = this.specialtyScrollerRef?.nativeElement;
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
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

  toggleFilter(): void {
    this.filterOpen = !this.filterOpen;
  }

  setFilter(categoryId: string): void {
    this.selectedFilter = categoryId;
    this.filterOpen = false;
  }

  clearFilter(): void {
    this.selectedFilter = null;
    this.filterOpen = false;
  }

  getFilteredProducts(): Product[] {
    let products = this.products.filter(p => {
      if (!this.selectedCategory) return true;
      if (p.category !== this.selectedCategory) return false;
      if (this.selectedSubCategoryFilter !== 'All' && p.subCategory !== this.selectedSubCategoryFilter) return false;
      return true;
    });

    // Apply search filter
    if (this.searchQuery.trim()) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.nameHindi?.includes(this.searchQuery) ||
        p.subCategory.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    return products;
  }

  getFilteredCategories() {
    if (!this.searchQuery.trim()) return this.navigationStructure.categories;
    
    return this.navigationStructure.categories.filter(cat => {
      const hasMatchingProducts = this.products.some(p =>
        p.category === cat.id && (
          p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          p.nameHindi?.includes(this.searchQuery) ||
          p.subCategory.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      );
      return hasMatchingProducts ||
             cat.name.toLowerCase().includes(this.searchQuery.toLowerCase());
    });
  }

  getCurrentCategory() {
    return this.navigationStructure.categories.find(c => c.id === this.selectedCategory);
  }

  // Chat functionality
  toggleChat(): void {
    this.chatOpen = !this.chatOpen;
  }

  async sendMessage(): Promise<void> {
    if (!this.currentMessage.trim()) return;

    const userMessage = this.currentMessage;
    this.chatMessages.push({ text: userMessage, sender: 'user' });
    this.currentMessage = '';

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate contextual response
    let aiResponse = '';
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('₹')) {
      aiResponse = 'Our products have competitive pricing with bulk discounts available! Regular prices start from ₹132 for instant coffee (100g) to premium items. Bulk orders (20kg+) get 12-15% additional discount. Would you like details on a specific product?';
    } else if (lowerMessage.includes('delivery') || lowerMessage.includes('shipping')) {
      aiResponse = 'We offer fast delivery across Mumbai and pan-India shipping. Orders above ₹500 get free delivery. Typical delivery time is 2-3 business days within Mumbai and 5-7 days pan-India.';
    } else if (lowerMessage.includes('tea') || lowerMessage.includes('chai') || lowerMessage.includes('चाय')) {
      aiResponse = 'We have an excellent range of teas! From CTC Masala Tea (most popular), Green Tea varieties including Kashmiri Kawa, to instant chai premixes. Our CTC Masala blend is a customer favorite at ₹572/kg. Which type interests you?';
    } else if (lowerMessage.includes('coffee') || lowerMessage.includes('कॉफ़ी')) {
      aiResponse = 'Our coffee selection includes Instant Regular Blended, Premium Arabica varieties, Roasted Beans, and Filter Coffee Powder. The Instant Regular is our best seller with multiple size options. Looking for a specific type?';
    } else if (lowerMessage.includes('bulk') || lowerMessage.includes('wholesale')) {
      aiResponse = 'Great! We offer attractive bulk pricing. For orders of 20kg+ on tea and 25kg+ on coffee/premixes, you get 12-15% extra discount. We also provide dedicated support for bulk buyers. What quantities are you looking at?';
    } else if (lowerMessage.includes('organic') || lowerMessage.includes('premium')) {
      aiResponse = 'Our premium range includes Kashmiri Kawa Green Tea, Pure Kashmiri Organic Kesar (Saffron), and 100% Arabica Coffee Beans. All sourced from authentic suppliers with quality certifications. Would you like more details?';
    } else {
      aiResponse = 'Thank you for your question! We have a wide range of premium teas, coffees, instant mixes, and specialty items. Our team can help you find exactly what you need. Could you tell me more about what you\'re looking for?';
    }

    this.chatMessages.push({ text: aiResponse, sender: 'bot' });

    // Add follow-up message
    await new Promise(resolve => setTimeout(resolve, 800));
    this.chatMessages.push({ text: 'Hope this helps, anything else?', sender: 'bot' });
  }

  clearSearch(): void {
    this.searchQuery = '';
  }

  // Image helper methods
  getProductImageUrl(productId: string): string {
    return this.imageAssetsService.getProductImage(productId, 'main');
  }

  getProductThumbnailUrl(productId: string): string {
    return this.imageAssetsService.getProductImage(productId, 'thumbnail');
  }

  getCategoryImageUrl(categoryId: string): string {
    return this.imageAssetsService.getCategoryImage(categoryId, 'banner');
  }

  getCategoryIconUrl(categoryId: string): string {
    return this.imageAssetsService.getCategoryImage(categoryId, 'icon');
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop&auto=format';
  }

  onCategoryImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&auto=format';
  }
}
