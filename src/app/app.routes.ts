import { Route, Routes } from "@angular/router";
import { authGuard } from "./guards/auth.guard";
import { CartComponent } from "./pages/cart/cart.component";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { ProductDetailComponent } from "./pages/product-detail/product-detail.component";
import { ProductFormComponent } from "./pages/product-form/product-form.component";
import { ProductsComponent } from "./pages/products/products.component";

export const routes: Routes = [

  { path: '', component: HomeComponent },

  { path: 'login', component: LoginComponent },

  // 👇 RUTAS ESPECÍFICAS PRIMERO
  {
    path: 'products/new',
    component: ProductFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'products/edit/:id',
    component: ProductFormComponent,
    canActivate: [authGuard]
  },

  // 👇 LISTADO
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [authGuard]
  },

  // 👇 DETALLE AL FINAL
  {
    path: 'products/:id',
    component: ProductDetailComponent
  },

  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
];
