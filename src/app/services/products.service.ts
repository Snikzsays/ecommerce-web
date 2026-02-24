import { Injectable } from '@angular/core';
import { Product, NavigationStructure } from '../models/store.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  readonly NAVIGATION_STRUCTURE: NavigationStructure = {
    categories: [
      {
        id: 'tea',
        name: 'Tea',
        icon: '🍵',
        subCategories: ['All', 'Black Tea (CTC)', 'Green Tea', 'Herbal Tea'],
      },
      {
        id: 'coffee',
        name: 'Coffee',
        icon: '☕',
        subCategories: ['All', 'Instant Coffee', 'Filter Coffee Powder', 'Roasted Beans'],
      },
      {
        id: 'instant-mixes',
        name: 'Instant Mixes',
        icon: '🥤',
        subCategories: ['All', 'Chai Premix', 'Ice Tea Premix'],
      },
      {
        id: 'specialty',
        name: 'Specialty',
        icon: '⭐',
        subCategories: ['All', 'Organic Saffron'],
      },
    ],
  };

  readonly PRODUCTS: Product[] = [
    // Tea Category
    {
      id: 'tea-1',
      name: 'Assam Premium CTC',
      nameHindi: 'असम प्रीमियम सीटीसी',
      category: 'tea',
      subCategory: 'Black Tea (CTC)',
      badge: 'Best Seller',
      variants: [
        { size: '250g', mrp: 450, discountedPrice: 375, bulkPrice: 300, bulkMinQty: 20 },
      ],
    },
    {
      id: 'tea-2',
      name: 'Green Tea Premium',
      nameHindi: 'ग्रीन टी प्रीमियम',
      category: 'tea',
      subCategory: 'Green Tea',
      badge: 'Popular',
      variants: [
        { size: '200g', mrp: 350, discountedPrice: 280 },
      ],
    },
    {
      id: 'tea-3',
      name: 'Herbal Chamomile',
      nameHindi: 'हर्बल कैमोमाइल',
      category: 'tea',
      subCategory: 'Herbal Tea',
      variants: [
        { size: '150g', mrp: 300, discountedPrice: 240 },
      ],
    },
    {
      id: 'tea-4',
      name: 'Darjeeling First Flush',
      nameHindi: 'दार्जिलिंग फर्स्ट फ्लश',
      category: 'tea',
      subCategory: 'Black Tea (CTC)',
      badge: 'Fresh Stock',
      variants: [
        { size: '100g', mrp: 500, discountedPrice: 400 },
      ],
    },
    {
      id: 'tea-5',
      name: 'Kashmiri Kahwa',
      nameHindi: 'कश्मीरी कहवा',
      category: 'tea',
      subCategory: 'Herbal Tea',
      variants: [
        { size: '100g', mrp: 450, discountedPrice: 375 },
      ],
    },

    // Coffee Category
    {
      id: 'coffee-1',
      name: 'Instant Coffee',
      nameHindi: 'इंस्टेंट कॉफी',
      category: 'coffee',
      subCategory: 'Instant Coffee',
      badge: 'Popular',
      variants: [
        { size: '100g', mrp: 320, discountedPrice: 250, bulkPrice: 200, bulkMinQty: 20 },
      ],
    },
    {
      id: 'coffee-2',
      name: 'Filter Coffee Powder',
      nameHindi: 'फिल्टर कॉफी पाउडर',
      category: 'coffee',
      subCategory: 'Filter Coffee Powder',
      variants: [
        { size: '250g', mrp: 400, discountedPrice: 320 },
      ],
    },
    {
      id: 'coffee-3',
      name: 'Roasted Coffee Beans',
      nameHindi: 'भुनी हुई कॉफी बीन्स',
      category: 'coffee',
      subCategory: 'Roasted Beans',
      badge: 'Best Seller',
      variants: [
        { size: '250g', mrp: 500, discountedPrice: 400 },
      ],
    },

    // Instant Mixes Category
    {
      id: 'mix-1',
      name: 'Chai Premix',
      nameHindi: 'चाय प्रीमिक्स',
      category: 'instant-mixes',
      subCategory: 'Chai Premix',
      badge: 'Popular',
      variants: [
        { size: '500g', mrp: 350, discountedPrice: 270 },
      ],
    },
    {
      id: 'mix-2',
      name: 'Ice Tea Premix',
      nameHindi: 'आइस टी प्रीमिक्स',
      category: 'instant-mixes',
      subCategory: 'Ice Tea Premix',
      variants: [
        { size: '200g', mrp: 250, discountedPrice: 200 },
      ],
    },

    // Specialty Category
    {
      id: 'specialty-1',
      name: 'Organic Saffron',
      nameHindi: 'ऑर्गेनिक केसर',
      category: 'specialty',
      subCategory: 'Organic Saffron',
      badge: 'Best Seller',
      variants: [
        { size: '1g', mrp: 500, discountedPrice: 450 },
      ],
    },
  ];

  readonly BULK_OPTIONS = [
    { label: '20 kgs', value: 20 },
    { label: '25 kgs', value: 25 },
    { label: '30 kgs', value: 30 },
    { label: '40 kgs', value: 40 },
    { label: '50 kgs', value: 50 },
    { label: '75 kgs', value: 75 },
    { label: '100 kgs', value: 100 },
  ];

  getProductsByCategory(categoryId: string): Product[] {
    return this.PRODUCTS.filter((p) => p.category === categoryId);
  }

  getProductsBySubCategory(categoryId: string, subCategory: string): Product[] {
    const products = this.getProductsByCategory(categoryId);
    if (subCategory === 'All') {
      return products;
    }
    return products.filter((p) => p.subCategory === subCategory);
  }

  getProductImage(product: Product): string {
    const colors: Record<string, string> = {
      'Black Tea (CTC)': '%238B4513,0%25,%23D2691E,100%25',
      'Green Tea': '%2390EE90,0%25,%23228B22,100%25',
      'Herbal Tea': '%23DDA0DD,0%25,%239370DB,100%25',
      'Instant Coffee': '%236F4E37,0%25,%23A0522D,100%25',
      'Filter Coffee Powder': '%238B4513,0%25,%23654321,100%25',
      'Roasted Beans': '%233E2723,0%25,%235D4037,100%25',
      'Chai Premix': '%23FF6B6B,0%25,%23FFB347,100%25',
      'Ice Tea Premix': '%2387CEEB,0%25,%234682B4,100%25',
      'Organic Saffron': '%23FFD700,0%25,%23FFA500,100%25',
    };

    const gradient = colors[product.subCategory] || '%23667eea,0%25,%23764ba2,100%25';
    const emoji =
      product.category === 'tea'
        ? '🍵'
        : product.category === 'coffee'
          ? '☕'
          : product.category === 'instant-mixes'
            ? '🥤'
            : '⭐';

    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><linearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"><stop offset="0%25" style="stop-color:${gradient.split(',')[0]};stop-opacity:1" /><stop offset="100%25" style="stop-color:${gradient.split(',')[2]};stop-opacity:1" /></linearGradient></defs><rect width="200" height="200" fill="url(%23grad)" rx="16"/><text x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="60" font-family="Arial">${emoji}</text></svg>`;
  }
}
