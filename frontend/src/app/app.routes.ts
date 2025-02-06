import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { UserRole } from './interfaces/user.interface';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'products', 
    component: ProductListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'products/new', 
    component: ProductFormComponent,
    canActivate: [AuthGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  { 
    path: 'products/edit/:id', 
    component: ProductFormComponent,
    canActivate: [AuthGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  { path: 'register', component: RegisterComponent },
];
