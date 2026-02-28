import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ImageAssetsService, ImageAsset } from '../../services/image-assets.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-figjam-image-import',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './figjam-image-import.html',
  styleUrls: ['./figjam-image-import.scss']
})
export class FigJamImageImportComponent implements OnInit {
  
  figJamUrl: string = '';
  extractionStep: 'enter-url' | 'extract-images' | 'configure-assets' | 'import-complete' = 'enter-url';
  extractedAssets: ImageAsset[] = [];
  isProcessing: boolean = false;
  errorMessage: string = '';
  
  constructor(
    private imageAssetsService: ImageAssetsService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onUrlSubmit(): void {
    if (!this.figJamUrl.trim()) {
      this.errorMessage = 'Please enter a FigJam URL';
      return;
    }

    if (!this.figJamUrl.includes('figma.com/make/') && !this.figJamUrl.includes('figma.com/file/')) {
      this.errorMessage = 'Please enter a valid Figma or FigJam URL';
      return;
    }

    this.errorMessage = '';
    this.extractionStep = 'extract-images';
    this.showExtractionInstructions();
  }

  showExtractionInstructions(): void {
    // Since FigJam doesn't have API access, provide manual extraction instructions
    this.extractionStep = 'extract-images';
  }

  onImagesUploaded(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;

    this.isProcessing = true;
    this.extractedAssets = [];

    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          const asset: ImageAsset = {
            id: `figjam-asset-${index}`,
            name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
            url: imageUrl,
            alt: `VU's Brew House ${file.name}`,
            category: this.detectImageCategory(file.name),
            tags: this.extractTagsFromFileName(file.name)
          };
          
          this.extractedAssets.push(asset);
          
          // If all files processed, move to next step
          if (this.extractedAssets.length === files.length) {
            this.isProcessing = false;
            this.extractionStep = 'configure-assets';
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  private detectImageCategory(fileName: string): 'product' | 'category' | 'banner' | 'icon' {
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes('banner') || lowerName.includes('hero')) return 'banner';
    if (lowerName.includes('icon') || lowerName.includes('logo')) return 'icon';
    if (lowerName.includes('category')) return 'category';
    return 'product';
  }

  private extractTagsFromFileName(fileName: string): string[] {
    const lowerName = fileName.toLowerCase();
    const tags: string[] = [];
    
    // Extract category tags
    ['tea', 'coffee', 'instant-mix', 'specialty'].forEach(cat => {
      if (lowerName.includes(cat)) tags.push(cat);
    });
    
    // Extract product specific tags
    ['assam', 'darjeeling', 'green', 'herbal', 'arabica', 'robusta', 'saffron'].forEach(product => {
      if (lowerName.includes(product)) tags.push(product);
    });

    return tags;
  }

  updateAssetInfo(index: number, field: keyof ImageAsset, value: string): void {
    if (this.extractedAssets[index]) {
      (this.extractedAssets[index] as any)[field] = value;
    }
  }

  removeAsset(index: number): void {
    this.extractedAssets.splice(index, 1);
  }

  importAssets(): void {
    if (this.extractedAssets.length === 0) {
      this.errorMessage = 'No assets to import';
      return;
    }

    this.isProcessing = true;
    
    // Import all configured assets
    this.imageAssetsService.updateImagesFromFigJam(this.extractedAssets);
    
    this.isProcessing = false;
    this.extractionStep = 'import-complete';
    
    // Success message
    console.log(`Successfully imported ${this.extractedAssets.length} assets from FigJam`);
  }

  previewInCatalog(): void {
    this.router.navigate(['/tea-catalog']);
  }

  startNewImport(): void {
    this.figJamUrl = '';
    this.extractionStep = 'enter-url';
    this.extractedAssets = [];
    this.errorMessage = '';
  }

  getCategoryDisplayName(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }
}