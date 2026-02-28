import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export type MetricType = 'revenue' | 'products' | 'sales' | 'views' | 'custom';

@Component({
  selector: 'ui-metric-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="metric-card">
      <div class="flex items-center justify-between mb-4">
        <div [class]="getIconClasses()">
          <mat-icon>{{ icon }}</mat-icon>
        </div>
        @if (trending !== undefined) {
          <span [class]="getTrendingClasses()">
            <mat-icon class="w-4 h-4">{{ trending > 0 ? 'trending_up' : trending < 0 ? 'trending_down' : 'trending_flat' }}</mat-icon>
            {{ Math.abs(trending) }}%
          </span>
        }
      </div>
      
      <div class="space-y-1">
        <p class="text-sm font-medium text-muted-foreground">{{ title }}</p>
        <div class="flex items-baseline space-x-2">
          <p class="text-2xl font-bold">{{ formattedValue }}</p>
          @if (suffix) {
            <span class="text-sm text-muted-foreground">{{ suffix }}</span>
          }
        </div>
        @if (description) {
          <p class="text-xs text-muted-foreground">{{ description }}</p>
        }
      </div>
    </div>
  `,
  styles: []
})
export class UiMetricCardComponent {
  @Input() title: string = '';
  @Input() value: number = 0;
  @Input() type: MetricType = 'custom';
  @Input() icon: string = 'analytics';
  @Input() trending: number | undefined;
  @Input() suffix: string = '';
  @Input() description: string = '';
  @Input() format: 'number' | 'currency' | 'percentage' = 'number';

  Math = Math;

  get formattedValue(): string {
    switch (this.format) {
      case 'currency':
        return new Intl.NumberFormat('en-IN', { 
          style: 'currency', 
          currency: 'INR',
          maximumFractionDigits: 0 
        }).format(this.value);
      case 'percentage':
        return `${this.value.toFixed(1)}%`;
      case 'number':
      default:
        return new Intl.NumberFormat('en-IN').format(this.value);
    }
  }

  getIconClasses(): string {
    const baseClasses = 'metric-card-icon';
    const typeClass = this.type !== 'custom' ? this.type : '';
    return [baseClasses, typeClass].filter(Boolean).join(' ');
  }

  getTrendingClasses(): string {
    const baseClasses = 'flex items-center gap-1 text-xs font-medium';
    if (this.trending === undefined) return baseClasses;
    
    if (this.trending > 0) {
      return `${baseClasses} text-green-600`;
    } else if (this.trending < 0) {
      return `${baseClasses} text-red-600`;
    } else {
      return `${baseClasses} text-gray-600`;
    }
  }
}