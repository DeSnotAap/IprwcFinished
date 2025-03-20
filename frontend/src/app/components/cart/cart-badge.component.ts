import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-badge',
  template: `
    <div class="cart-badge" *ngIf="itemCount > 0">
      {{ itemCount }}
    </div>
  `,
  styles: [`
    .cart-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background-color: #e53935;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: bold;
    }
  `]
})
export class CartBadgeComponent implements OnInit {
  itemCount = 0;
  
  constructor(private cartService: CartService) { }
  
  ngOnInit(): void {
    this.cartService.cartCount$.subscribe(count => {
      this.itemCount = count;
    });
  }
} 