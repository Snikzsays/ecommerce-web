// Data models and types
export interface ProductVariant {
  size: string;
  mrp: number;
  discountedPrice: number;
  bulkPrice?: number;
  bulkMinQty?: number;
}

export interface Product {
  id: string;
  name: string;
  nameHindi: string;
  category: 'tea' | 'coffee' | 'instant-mixes' | 'specialty';
  subCategory: string;
  variants: ProductVariant[];
  badge?: 'Popular' | 'Best Seller' | 'Fresh Stock';
}

export interface CartItem {
  productId: string;
  variantIndex: number;
  quantity: number;
  bulkKg?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subCategories: string[];
}

export interface NavigationStructure {
  categories: Category[];
}
