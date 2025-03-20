import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orderForm: FormGroup;
  isSubmitting = false;
  cart: Cart | null = null;
  loading = false;
  error = false;
  orderSuccess = false;
  submitting = false;
  errorMessage = '';
  
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.orderForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.loading = true;
    this.error = false;
    
    this.cartService.getCart().subscribe(
      (cart) => {
        this.cart = cart;
        this.loading = false;
        
        // Check if cart is empty
        if (cart.items.length === 0) {
          this.errorMessage = 'Your cart is empty. Please add items to your cart before proceeding to checkout.';
        }
      },
      (error) => {
        console.error('Error loading cart:', error);
        this.loading = false;
        this.error = true;
      }
    );
  }

  placeOrder(): void {
    if (this.orderForm.invalid) {
      // Mark all fields as touched to trigger validation errors
      Object.keys(this.orderForm.controls).forEach(key => {
        const control = this.orderForm.get(key);
        control?.markAsTouched();
      });
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    // Check if cart is empty before submitting
    if (!this.cart || !this.cart.items || this.cart.items.length === 0) {
      this.errorMessage = 'Your cart is empty. Please add items to your cart before placing an order.';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    const orderData = this.orderForm.value;

    this.orderService.createOrder(orderData).subscribe(
      (response) => {
        this.submitting = false;
        this.orderSuccess = true;
        
        // Clear the cart after successful order placement
        this.cartService.clearCart().subscribe(
          () => {
            console.log('Cart cleared after order creation');
          },
          (error) => {
            console.error('Error clearing cart:', error);
          }
        );
        
        console.log('Order created successfully:', response);
        this.router.navigate(['/order-summary', response.id]);
      },
      (error) => {
        this.submitting = false;
        this.errorMessage = 'Error creating order. Please try again.';
        console.error('Error creating order:', error);
      }
    );
  }

  get f() { 
    return this.orderForm.controls;
  }
  
  goToHome(): void {
    this.router.navigate(['/books']);
  }
} 