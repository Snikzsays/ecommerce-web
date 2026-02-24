import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

export type Category = { id: string; name: string; nameHindi: string };

@Component({
  selector: 'app-store-header',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './store-header.html',
  styleUrl: './store-header.scss',
})
export class StoreHeaderComponent {
  @Input() storeName: string = "VU's Brew House";
  @Input() storeTagline: string = 'Premium Teas • Mumbai';
  @Input() searchPlaceholder: string = 'Search teas... (चाय खोजें)';
  @Input() categories: Category[] = [];
  @Input() searchQuery: string = '';
  @Input() selectedCategory: string = 'all';
  @Input() showFilters: boolean = false;

  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() selectedCategoryChange = new EventEmitter<string>();
  @Output() showFiltersChange = new EventEmitter<boolean>();

  updateSearchQuery(value: string): void {
    this.searchQuery = value;
    this.searchQueryChange.emit(value);
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.selectedCategoryChange.emit(categoryId);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }
}
