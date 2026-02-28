import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface MerchantProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  status: 'Active' | 'Inactive';
  description?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MerchantStats {
  todayRevenue: number;
  todayOrders: number;
  activeProducts: number;
  lowStockCount: number;
  pendingOrders: number;
  monthlyGrowth: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  createdAt: Date;
  deliveryAddress: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class MerchantService {
  private merchantProductsSubject = new BehaviorSubject<MerchantProduct[]>([]);
  public merchantProducts$ = this.merchantProductsSubject.asObservable();

  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  private statsSubject = new BehaviorSubject<MerchantStats>({
    todayRevenue: 25400,
    todayOrders: 47,
    activeProducts: 23,
    lowStockCount: 3,
    pendingOrders: 12,
    monthlyGrowth: 15.5
  });
  public stats$ = this.statsSubject.asObservable();

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    // Initialize with sample VU's Brew House products
    const sampleProducts: MerchantProduct[] = [
      {
        id: 'tea-001',
        name: 'Assam Premium CTC',
        category: 'Black Tea',
        price: 299,
        stock: 45,
        image: 'https://images.unsplash.com/photo-1597318801175-41fda44ddc9b?w=400&h=300&fit=crop&auto=format',
        status: 'Active',
        description: 'Premium quality Assam CTC tea leaves with rich malty flavor',
        tags: ['premium', 'black-tea', 'strong'],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: 'tea-002',
        name: 'Earl Grey Classic',
        category: 'Flavored Tea',
        price: 399,
        stock: 32,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&auto=format',
        status: 'Active',
        description: 'Traditional Earl Grey with bergamot oil and cornflower petals',
        tags: ['earl-grey', 'bergamot', 'classic'],
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-18')
      },
      {
        id: 'tea-003',
        name: 'Himalayan Green Tea',
        category: 'Green Tea',
        price: 449,
        stock: 8, // Low stock
        image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400&h=300&fit=crop&auto=format',
        status: 'Active',
        description: 'High-altitude green tea from Himalayan gardens',
        tags: ['green-tea', 'himalayan', 'organic'],
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-19')
      },
      {
        id: 'coffee-001',
        name: 'Colombian Arabica',
        category: 'Coffee',
        price: 599,
        stock: 28,
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
        status: 'Active',
        description: 'Single-origin Colombian Arabica beans with chocolate notes',
        tags: ['coffee', 'arabica', 'colombian'],
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-16')
      },
      {
        id: 'tea-004',
        name: 'Masala Chai Blend',
        category: 'Spiced Tea',
        price: 349,
        stock: 0, // Out of stock
        image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop&auto=format',
        status: 'Inactive',
        description: 'Traditional Indian masala chai with aromatic spices',
        tags: ['masala-chai', 'spiced', 'indian'],
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-22')
      }
    ];

    const sampleOrders: Order[] = [
      {
        id: 'ORD-001',
        customerName: 'Rajesh Kumar',
        customerPhone: '+91-98765-43210',
        items: [
          { productId: 'tea-001', productName: 'Assam Premium CTC', quantity: 2, price: 299 }
        ],
        total: 598,
        status: 'Pending',
        createdAt: new Date(),
        deliveryAddress: '123 Tea Garden Road, Jorhat, Assam'
      },
      {
        id: 'ORD-002',
        customerName: 'Priya Sharma',
        customerPhone: '+91-87654-32109',
        items: [
          { productId: 'tea-002', productName: 'Earl Grey Classic', quantity: 1, price: 399 },
          { productId: 'coffee-001', productName: 'Colombian Arabica', quantity: 1, price: 599 }
        ],
        total: 998,
        status: 'Processing',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        deliveryAddress: '456 Garden Colony, New Delhi'
      }
    ];

    this.merchantProductsSubject.next(sampleProducts);
    this.ordersSubject.next(sampleOrders);
  }

  // Product Management Methods
  getProducts(): Observable<MerchantProduct[]> {
    return this.merchantProducts$;
  }

  addProduct(product: Omit<MerchantProduct, 'id' | 'createdAt' | 'updatedAt'>): Observable<MerchantProduct> {
    const newProduct: MerchantProduct = {
      ...product,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentProducts = this.merchantProductsSubject.value;
    this.merchantProductsSubject.next([...currentProducts, newProduct]);
    this.updateStats();

    return of(newProduct);
  }

  updateProduct(productId: string, updates: Partial<MerchantProduct>): Observable<MerchantProduct | null> {
    const currentProducts = this.merchantProductsSubject.value;
    const productIndex = currentProducts.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      return of(null);
    }

    const updatedProduct = {
      ...currentProducts[productIndex],
      ...updates,
      updatedAt: new Date()
    };

    currentProducts[productIndex] = updatedProduct;
    this.merchantProductsSubject.next([...currentProducts]);
    this.updateStats();

    return of(updatedProduct);
  }

  deleteProduct(productId: string): Observable<boolean> {
    const currentProducts = this.merchantProductsSubject.value;
    const filteredProducts = currentProducts.filter(p => p.id !== productId);
    
    if (filteredProducts.length === currentProducts.length) {
      return of(false); // Product not found
    }

    this.merchantProductsSubject.next(filteredProducts);
    this.updateStats();
    return of(true);
  }

  // Order Management Methods
  getOrders(): Observable<Order[]> {
    return this.orders$;
  }

  updateOrderStatus(orderId: string, status: Order['status']): Observable<Order | null> {
    const currentOrders = this.ordersSubject.value;
    const orderIndex = currentOrders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
      return of(null);
    }

    currentOrders[orderIndex].status = status;
    this.ordersSubject.next([...currentOrders]);
    this.updateStats();

    return of(currentOrders[orderIndex]);
  }

  // Analytics Methods
  getStats(): Observable<MerchantStats> {
    return this.stats$;
  }

  getProductAnalytics(productId: string): Observable<any> {
    // Simulate product analytics data
    return of({
      productId,
      views: Math.floor(Math.random() * 1000) + 100,
      sales: Math.floor(Math.random() * 50) + 10,
      revenue: Math.floor(Math.random() * 10000) + 2000,
      conversionRate: Math.round((Math.random() * 5 + 2) * 100) / 100,
      topRegions: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'],
      monthlyTrend: Array.from({ length: 6 }, () => Math.floor(Math.random() * 100) + 20)
    });
  }

  exportCatalog(): Observable<Blob> {
    const products = this.merchantProductsSubject.value;
    const csvContent = this.generateCSV(products);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    return of(blob);
  }

  // Private Helper Methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private updateStats(): void {
    const products = this.merchantProductsSubject.value;
    const orders = this.ordersSubject.value;

    const activeProducts = products.filter(p => p.status === 'Active').length;
    const lowStockProducts = products.filter(p => p.stock < 10).length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;

    // Calculate today's metrics (simulated)
    const todayOrders = orders.filter(o => {
      const today = new Date();
      const orderDate = new Date(o.createdAt);
      return orderDate.toDateString() === today.toDateString();
    }).length;

    const todayRevenue = orders
      .filter(o => {
        const today = new Date();
        const orderDate = new Date(o.createdAt);
        return orderDate.toDateString() === today.toDateString();
      })
      .reduce((sum, order) => sum + order.total, 0);

    const newStats: MerchantStats = {
      todayRevenue,
      todayOrders,
      activeProducts,
      lowStockCount: lowStockProducts,
      pendingOrders,
      monthlyGrowth: 15.5 // Simulated growth
    };

    this.statsSubject.next(newStats);
  }

  private generateCSV(products: MerchantProduct[]): string {
    const headers = ['ID', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Created Date'];
    const rows = products.map(product => [
      product.id,
      product.name,
      product.category,
      product.price.toString(),
      product.stock.toString(),
      product.status,
      product.createdAt.toLocaleDateString()
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}