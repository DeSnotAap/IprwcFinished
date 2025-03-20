import { Component, OnInit } from '@angular/core';
import { Cart, CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  loading = true;
  error = false;
  
  constructor(
    private cartService: CartService,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    this.loadCart();
  }
  
  loadCart(): void {
    this.loading = true;
    this.error = false;
    
    this.cartService.getCart().subscribe(
      (cart) => {
        this.cart = cart;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading cart:', error);
        this.loading = false;
        this.error = true;
      }
    );
  }
  
  updateQuantity(item: CartItem, event: Event | number): void {
    let newQuantity: number;
    
    if (typeof event === 'number') {
      newQuantity = event;
    } else {
      // Handle the event object and safely extract the value
      const input = event.target as HTMLInputElement;
      newQuantity = parseInt(input.value, 10);
    }
    
    if (newQuantity < 1) {
      return;
    }
    
    if (newQuantity === item.quantity) {
      return;
    }
    
    this.cartService.updateQuantity(item.id, newQuantity).subscribe(
      (updatedItem) => {
        this.loadCart();
      },
      (error) => {
        console.error('Error updating quantity:', error);
      }
    );
  }
  
  removeItem(itemId: number): void {
    this.cartService.removeItem(itemId).subscribe(
      () => {
        this.loadCart();
      },
      (error) => {
        console.error('Error removing item:', error);
      }
    );
  }
  
  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart().subscribe(
        () => {
          this.loadCart();
        },
        (error) => {
          console.error('Error clearing cart:', error);
        }
      );
    }
  }
  
  incrementQuantity(item: CartItem): void {
    this.updateQuantity(item, item.quantity + 1);
  }
  
  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.updateQuantity(item, item.quantity - 1);
    }
  }

  proceedToCheckout(): void {
    this.router.navigate(['/order']);
  }
} 