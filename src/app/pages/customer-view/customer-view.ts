import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { StoreHeaderComponent, type Category } from '../../components/store-header/store-header';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-view',
  standalone: true,
  imports: [MatIconModule, StoreHeaderComponent, CommonModule],
  templateUrl: './customer-view.html',
  styleUrl: './customer-view.scss',
})
export class CustomerView {
  storeName = "VU's Brew House";
  storeTagline = 'Premium Teas • Mumbai';
  searchQuery = '';
  selectedCategory = 'all';
  showFilters = false;

  categories: Category[] = [
    { id: 'all', name: 'All Teas', nameHindi: 'सभी चाय' },
    { id: 'black', name: 'Black Tea', nameHindi: 'ब्लैक टी' },
    { id: 'green', name: 'Green Tea', nameHindi: 'ग्रीन टी' },
    { id: 'premix', name: 'Premix', nameHindi: 'प्रीमिक्स' },
    { id: 'ice-tea', name: 'Ice Tea', nameHindi: 'आइस टी' },
  ];
}
