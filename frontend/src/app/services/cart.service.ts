import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AddToCartRequest, Cart, CartItem, UpdateCartItemRequest } from '../models/cart.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl + '/cart';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  //private apiUrl = 'http://localhost:8081/api/cart';
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.loadCartCount();
  }
  
  /**
   * Check if user is admin - admins don't have cart access
   */
  private isAdmin(): boolean {
    return this.authService.isAdmin();
  }
  
  /**
   * Get the current user's cart
   */
  getCart(): Observable<Cart> {
    if (!this.authService.isLoggedIn() || this.isAdmin()) {
        // Return empty cart for admins or unauthenticated users
      return of({ 
        id: 0, 
        items: [], 
        itemCount: 0,
        subtotal: 0,
        total: 0 
      } as Cart);
    }
    return this.http.get<Cart>(API_URL).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }
  
  /**
   * Add an item to the cart
   */
  addToCart(bookId: number, quantity: number): Observable<CartItem> {
    if (!this.authService.isLoggedIn() || this.isAdmin()) {
      return of({} as CartItem);
    }
    const request: AddToCartRequest = { bookId, quantity };
    return this.http.post<CartItem>(`${API_URL}/items`, request).pipe(
      tap(() => this.loadCartCount())
    );
  }
  
  /**
   * Update cart item quantity
   */
  updateQuantity(itemId: number, quantity: number): Observable<CartItem> {
    if (!this.authService.isLoggedIn() || this.isAdmin()) {
      return of({} as CartItem);
    }
    const request: UpdateCartItemRequest = { quantity };
    return this.http.put<CartItem>(`${API_URL}/items/${itemId}`, request).pipe(
      tap(() => this.loadCartCount())
    );
  }
  
  /**
   * Remove an item from the cart
   */
  removeItem(itemId: number): Observable<any> {
    if (!this.authService.isLoggedIn() || this.isAdmin()) {
      return of({});
    }
    return this.http.delete(`${API_URL}/items/${itemId}`).pipe(
      tap(() => this.loadCartCount())
    );
  }
  
  /**
   * Get the number of items in the cart
   */
  loadCartCount(): void {
    if (!this.authService.isLoggedIn() || this.isAdmin()) {
      this.cartCountSubject.next(0);
      return;
    }
    
    this.http.get<{ count: number }>(`${API_URL}/count`).subscribe({
      next: (response) => this.cartCountSubject.next(response.count),
      error: (error) => {
          console.log('Error loading cart count:');
        // Handle 401 errors quietly, just reset cart count
        if (error.status === 401) {
          this.cartCountSubject.next(0);
        } else {
          console.error('Error loading cart count:', error);
        }
      }
    });
  }
  
  /**
   * Clear the cart
   */
  clearCart(): Observable<any> {
    if (!this.authService.isLoggedIn() || this.isAdmin()) {
      return of({});
    }
    return this.http.delete(API_URL).pipe(
      tap(() => {
        this.cartCountSubject.next(0);
        this.cartSubject.next(null);
      })
    );
  }
} 
