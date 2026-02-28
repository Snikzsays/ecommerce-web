import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantRoutingModule } from './merchant-routing-module';
import { MerchantLayout } from './merchant-layout/merchant-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Orders } from './pages/orders/orders';
import { Products } from './pages/products/products';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MerchantRoutingModule,
    MerchantLayout,
    Dashboard,
    Orders,
    Products
  ],
})
export class MerchantModule {}