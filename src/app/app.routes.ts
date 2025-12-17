import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { CartComponent } from './pages/cart/cart.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductFormComponent } from './pages/product-form/product-form.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  { path: '', component: HomeComponent },

  { path: 'login', component: LoginComponent },

  { path: 'cart', component: CartComponent },

  
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'products/new',
    component: ProductFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'products/edit/:id',
    component: ProductFormComponent,
    canActivate: [authGuard]
  }
];
