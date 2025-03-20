import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnInit {
  order: any;
  isLoading = true;
  error = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrder(parseInt(orderId));
    }
  }

  loadOrder(orderId: number): void {
    this.isLoading = true;
    this.error = false;
    
    this.orderService.getOrderById(orderId).subscribe(
      (order) => {
        this.order = order;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.error = true;
        this.errorMessage = 'Error loading order details. Please try again.';
        console.error('Error loading order:', error);
      }
    );
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
} 