import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CartComponent } from './components/cart/cart.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'products',
    children: [
      { 
        path: '',
        component: ProductListComponent,
        canActivate: [AuthGuard]
      },
      { 
        path: 'new',
        component: ProductFormComponent,
        canActivate: [AuthGuard, RoleGuard]
      },
      { 
        path: 'edit/:id',
        component: ProductFormComponent,
        canActivate: [AuthGuard, RoleGuard]
      }
    ]
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    component: OrderListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/orders',
    component: AdminOrdersComponent,
    canActivate: [AuthGuard, RoleGuard]
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard]
  },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
];
