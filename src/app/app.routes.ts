import { Routes } from '@angular/router';
import { CustomerView } from './pages/customer-view/customer-view';
import { CatalogComponent } from './components/catalog/catalog';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tea-catalog',
    pathMatch: 'full',
  },
  {
    path: 'customer',
    component: CustomerView,
  },
  {
    path: 'tea-catalog',
    component: CatalogComponent,
  },
];
