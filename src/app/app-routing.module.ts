import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductCreateComponent } from './components/product-create/product-create.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { OrderListComponent } from "./components/order-list/order-list.component";
import { authGuard, noAuthGuard } from './services/auth/auth-guard/auth.guard';
import { UserRole } from './enums/user-role';
import { BakerOrderListComponent } from './components/baker-order-list/baker-order-list.component';
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { SuppliesListComponent } from "./components/supplies/supplies-list/supplies-list.component";

const routes: Routes = [{
  path: 'login',
  component: LoginComponent,
  canActivate: [noAuthGuard]
}, {
  path: 'register',
  component: RegisterComponent,
  canActivate: [noAuthGuard]
}, {
  path: 'profile',
  component: UserProfileComponent,
  canActivate: [authGuard],
  data: { roles: [UserRole.ADMIN, UserRole.BAKER, UserRole.USER] }
}, {
  path: 'products',
  component: ProductListComponent,
  canActivate: [authGuard],
  data: { roles: [UserRole.ADMIN, UserRole.BAKER, UserRole.USER] }
}, {
  path: 'products/edit/:id',
  component: ProductCreateComponent,
  canActivate: [authGuard],
  data: { roles: [UserRole.ADMIN] }
}, {
  path: 'products/new',
  component: ProductCreateComponent,
  canActivate: [authGuard],
  data: { roles: [UserRole.ADMIN] }
}, {
  path: 'shopping-cart',
  component: ShoppingCartComponent,
  canActivate: [authGuard],
  data: { roles: [UserRole.USER] }
}, {
  path: 'orders',
  component: OrderListComponent,
  canActivate: [authGuard],
  data: { roles: [UserRole.ADMIN, UserRole.BAKER, UserRole.USER] }
}, {
  path: 'my-orders',
  component: BakerOrderListComponent,
  canActivate: [authGuard],
  data: { roles: [UserRole.BAKER] }
}, {
  path: 'supplies',
  component: SuppliesListComponent,
  canActivate: [authGuard],
  data: { roles: [UserRole.ADMIN] }
}, {
  path: '**',
  redirectTo: '/products'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
