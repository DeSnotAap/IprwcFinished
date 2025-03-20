import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { BookListComponent } from './components/book-catalog/book-list.component';
import { BookDetailComponent } from './components/book-catalog/book-detail.component';
import { CategoryListComponent } from './components/category/category-list.component';
import { CartComponent } from './components/cart/cart.component';
import { PlaceholderComponent } from './components/placeholder/placeholder.component';
import { OrderComponent } from './components/order/order.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { NonAdminGuard } from './guards/non-admin.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'books', component: BookListComponent },
  { path: 'books/:id', component: BookDetailComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard, NonAdminGuard] },
  { path: 'about', component: PlaceholderComponent, data: { title: 'About Us' } },
  { path: 'contact', component: PlaceholderComponent, data: { title: 'Contact Us' } },
  { path: 'order', component: OrderComponent, canActivate: [AuthGuard] },
  { path: 'order-summary/:id', component: OrderSummaryComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  { path: '**', component: PlaceholderComponent, data: { title: 'Page Not Found' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 