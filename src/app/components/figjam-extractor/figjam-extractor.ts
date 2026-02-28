import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ImageAssetsService } from '../../services/image-assets.service';

@Component({
  selector: 'app-figjam-extractor',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './figjam-extractor.html',
  styleUrls: ['./figjam-extractor.scss']
})
export class FigJamExtractorComponent {
  
  uploadedImage: string = '';
  generatedCode: string = '';
  
  constructor(
    private router: Router,
    private imageAssetsService: ImageAssetsService
  ) {}

  onImageUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.uploadedImage = e.target?.result as string;
      this.generateCode();
    };
    reader.readAsDataURL(file);
  }

  clearImage(): void {
    this.uploadedImage = '';
    this.generatedCode = '';
  }

  generateCode(): void {
    if (!this.uploadedImage) return;

    this.generatedCode = `{
  id: 'tea-1',
  name: 'CTC Tea - Silver (From Your FigJam Design)',
  url: '${this.uploadedImage}',
  alt: 'VU\\'s Brew House CTC Tea - Silver with tea leaves and cup from FigJam',
  category: 'product',
  tags: ['tea', 'ctc', 'silver', 'figjam-design', 'premium']
},`;
  }

  async copyCode(): Promise<void> {
    if (!this.generatedCode) return;
    
    try {
      await navigator.clipboard.writeText(this.generatedCode);
      this.showNotification('Code copied to clipboard! 📋');
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  }

  applyAutomatically(): void {
    if (!this.uploadedImage) return;

    // Update the image assets service directly
    const newAsset = {
      id: 'tea-1',
      name: 'CTC Tea - Silver (From FigJam Design)',
      url: this.uploadedImage,
      alt: 'VU\'s Brew House CTC Tea - Silver with tea leaves and cup from FigJam',
      category: 'product' as const,
      tags: ['tea', 'ctc', 'silver', 'figjam-design', 'premium']
    };

    this.imageAssetsService.addImageAsset(newAsset);
    this.showNotification('Image applied automatically! ✅ Check your catalog now.');
  }

  openCatalog(): void {
    window.open('/tea-catalog', '_blank');
  }

  async runBuild(): Promise<void> {
    this.showNotification('Build command would be: ng build 🔧');
    // In a real implementation, you might call a build service
  }

  private showNotification(message: string): void {
    // Create a simple toast notification
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}