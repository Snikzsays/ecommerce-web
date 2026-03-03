import { Injectable } from '@angular/core';

export interface ImageAsset {
  id: string;
  name: string;
  url: string;
  alt: string;
  category: 'product' | 'category' | 'banner' | 'icon';
  tags?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ImageAssetsService {
  // Default placeholder images
  private readonly DEFAULT_IMAGES = {
    product: 'assets/images/tea-1-main.jpg',
    category:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&auto=format',
    banner:
      'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&h=400&fit=crop&auto=format',
  };

  // Image library - seeded with known assets (can be extended from FigJam)
  private imageLibrary: ImageAsset[] = [
    // Product images
    {
      id: 'tea-1-main',
      name: 'CTC Tea - Silver (FigJam)',
      url: 'assets/images/tea-1-main.jpg',
      alt: "VU's Brew CTC Tea - Silver from FigJam design",
      category: 'product',
      tags: ['tea', 'ctc', 'product'],
    },
    {
      id: 'coffee-products-main',
      name: "VU's Brew Coffee Jars Hero",
      url: 'assets/images/coffee.png',
      alt: "VU's Brew instant coffee jars assortment",
      category: 'product',
      tags: ['coffee', 'hero', 'product'],
    },
    {
      id: 'coffee-3-main',
      name: 'Roasted Coffee Beans Jars',
      url: 'assets/images/coffee.png',
      alt: "VU's Brew roasted coffee beans jars on counter",
      category: 'product',
      tags: ['coffee', 'roasted-beans', 'product'],
    },

    // Category / banner images
    {
      id: 'tea-category-banner',
      name: 'Tea Category Banner',
      url: 'assets/images/tea-banner.jpg',
      alt: "VU's Brew House Premium Tea Collection",
      category: 'banner',
      tags: ['tea', 'banner', 'category'],
    },
    {
      id: 'coffee-category-banner',
      name: 'Coffee Category Banner',
      url: 'assets/images/coffee-banner.jpg',
      alt: "VU's Brew House Premium Coffee Collection",
      category: 'banner',
      tags: ['coffee', 'banner', 'category'],
    },
  ];

  constructor() {}

  /** Get image URL for a product, with fallback to placeholder */
  getProductImage(
    productId: string,
    imageType: 'main' | 'thumbnail' | 'gallery' = 'main',
  ): string {
    const image = this.imageLibrary.find(
      (img) =>
        img.id === `${productId}-${imageType}` ||
        img.id === productId ||
        img.id === `${productId}-main`,
    );
    if (image) {
      return image.url;
    }

    // Special fallback: use coffee hero image for all coffee products
    if (productId.startsWith('coffee-')) {
      const coffeeHero = this.imageLibrary.find((img) => img.id === 'coffee-products-main');
      if (coffeeHero) {
        return coffeeHero.url;
      }
    }

    return this.DEFAULT_IMAGES.product;
  }

  /** Get category image (banner or icon) */
  getCategoryImage(
    categoryId: string,
    imageType: 'banner' | 'icon' | 'thumbnail' = 'banner',
  ): string {
    const image = this.imageLibrary.find(
      (img) =>
        img.id === `${categoryId}-${imageType}` ||
        img.id === `${categoryId}-${imageType}-image` ||
        (img.tags?.includes(categoryId) && img.category === imageType),
    );
    return image?.url || this.DEFAULT_IMAGES.category;
  }

  /** Get all images for a specific category or product */
  getImageGallery(entityId: string): ImageAsset[] {
    return this.imageLibrary.filter(
      (img) => img.id.startsWith(entityId) || img.tags?.includes(entityId),
    );
  }

  /** Add or replace a single image asset */
  addImageAsset(asset: ImageAsset): void {
    const existingIndex = this.imageLibrary.findIndex((img) => img.id === asset.id);
    if (existingIndex >= 0) {
      this.imageLibrary[existingIndex] = asset;
    } else {
      this.imageLibrary.push(asset);
    }
  }

  /** Batch update images (e.g. from FigJam export) */
  updateImagesFromFigJam(assets: ImageAsset[]): void {
    assets.forEach((asset) => this.addImageAsset(asset));
  }

  /** Get image with basic optimization support for remote providers */
  getOptimizedImageUrl(imageId: string, width?: number, height?: number): string {
    const image = this.imageLibrary.find((img) => img.id === imageId);
    if (!image) return this.DEFAULT_IMAGES.product;

    let url = image.url;
    if (width && height && (url.includes('figma') || url.includes('unsplash'))) {
      url += `?w=${width}&h=${height}&fit=crop&auto=format`;
    }

    return url;
  }

  /** Check if image exists and is accessible */
  async validateImageUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  /** Bulk import images from FigJam (to be called with extracted assets) */
  importFromFigJamData(figJamAssets: any[]): void {
    const imageAssets: ImageAsset[] = figJamAssets.map((asset) => ({
      id: asset.id || asset.name?.toLowerCase().replace(/\s+/g, '-'),
      name: asset.name || 'Untitled Asset',
      url: asset.url || asset.src,
      alt: asset.alt || asset.name || "VU's Brew House Asset",
      category: this.detectImageCategory(asset.name || asset.id),
      tags: this.extractTagsFromName(asset.name || asset.id),
    }));

    this.updateImagesFromFigJam(imageAssets);
    console.log(`Imported ${imageAssets.length} images from FigJam`);
  }

  private detectImageCategory(name: string): 'product' | 'category' | 'banner' | 'icon' {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('banner') || lowerName.includes('hero')) return 'banner';
    if (lowerName.includes('icon') || lowerName.includes('logo')) return 'icon';
    if (lowerName.includes('category')) return 'category';
    return 'product';
  }

  private extractTagsFromName(name: string): string[] {
    const lowerName = name.toLowerCase();
    const tags: string[] = [];

    ['tea', 'coffee', 'instant-mixes', 'specialty'].forEach((cat) => {
      if (lowerName.includes(cat)) tags.push(cat);
    });

    ['product', 'category', 'banner', 'icon', 'thumbnail'].forEach((type) => {
      if (lowerName.includes(type)) tags.push(type);
    });

    return tags;
  }
}
