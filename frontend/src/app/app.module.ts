import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookListComponent } from './components/book-catalog/book-list.component';
import { BookDetailComponent } from './components/book-catalog/book-detail.component';
import { PlaceholderComponent } from './components/placeholder/placeholder.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { CategoryListComponent } from './components/category/category-list.component';
import { CartComponent } from './components/cart/cart.component';
import { CartBadgeComponent } from './components/cart/cart-badge.component';
import { AuthService } from './services/auth.service';
import { TokenInterceptor } from './services/token-interceptor.service';
import { CartService } from './services/cart.service';
import { OrderService } from './services/order.service';
import { AuthGuard } from './guards/auth.guard';
import { OrderComponent } from './components/order/order.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';
import { AdminBooksComponent } from './components/admin/admin-books/admin-books.component';

@NgModule({
  declarations: [
    AppComponent,
    BookListComponent,
    BookDetailComponent,
    PlaceholderComponent,
    LoginComponent,
    RegisterComponent,
    CategoryListComponent,
    CartComponent,
    CartBadgeComponent,
    OrderComponent,
    OrderSummaryComponent,
    AdminDashboardComponent,
    AdminUsersComponent,
    AdminOrdersComponent,
    AdminBooksComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    AuthService,
    CartService,
    OrderService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { } 