import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders: any[] = [];
  isLoading = true;
  error = false;
  errorMessage = '';
  statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];
  selectedOrder: any = null;
  editMode = false;
  orderForm: FormGroup;
  updateSuccess = false;
  updateError = false;
  updateErrorMessage = '';
  
  constructor(
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
    this.orderForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      address: ['', [Validators.required, Validators.maxLength(255)]],
      status: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.error = false;
    
    this.adminService.getAllOrders().subscribe(
      (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.error = true;
        this.errorMessage = 'Error loading orders. Please try again.';
        console.error('Error loading orders:', error);
      }
    );
  }

  viewOrderDetails(order: any): void {
    this.selectedOrder = order;
    this.editMode = false;
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
    this.editMode = false;
  }

  updateOrderStatus(orderId: number, status: string): void {
    this.adminService.updateOrderStatus(orderId, { status }).subscribe(
      (data) => {
        // Update the order in the local array
        const index = this.orders.findIndex(order => order.id === orderId);
        if (index !== -1) {
          this.orders[index].status = status;
        }
        // If we're viewing the details of this order, update that too
        if (this.selectedOrder && this.selectedOrder.id === orderId) {
          this.selectedOrder.status = status;
        }
      },
      (error) => {
        console.error('Error updating order status:', error);
      }
    );
  }

  onStatusChange(event: Event, orderId: number): void {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement) {
      this.updateOrderStatus(orderId, selectElement.value);
    }
  }
  
  editOrderFromTable(order: any): void {
    // First set the selected order
    this.selectedOrder = order;
    // Then enable edit mode and set up the form
    this.editMode = true;
    this.updateSuccess = false;
    this.updateError = false;
    
    // Fill the form with the order data
    this.orderForm.setValue({
      firstName: order.firstName || '',
      lastName: order.lastName || '',
      email: order.email || '',
      address: order.address || '',
      status: order.status || 'PENDING'
    });
  }
  
  editOrderDetails(): void {
    this.editMode = true;
    this.updateSuccess = false;
    this.updateError = false;
    
    // Fill the form with the current order data
    this.orderForm.setValue({
      firstName: this.selectedOrder.firstName || '',
      lastName: this.selectedOrder.lastName || '',
      email: this.selectedOrder.email || '',
      address: this.selectedOrder.address || '',
      status: this.selectedOrder.status || 'PENDING'
    });
  }
  
  cancelEdit(): void {
    this.editMode = false;
  }
  
  saveOrderDetails(): void {
    if (this.orderForm.invalid) {
      return;
    }
    
    const orderData = {
      ...this.orderForm.value
    };
    
    this.adminService.updateOrder(this.selectedOrder.id, orderData).subscribe(
      (data) => {
        // Update the order in the local array
        const index = this.orders.findIndex(order => order.id === this.selectedOrder.id);
        if (index !== -1) {
          this.orders[index] = {
            ...this.orders[index],
            ...orderData
          };
        }
        
        // Update the selected order
        this.selectedOrder = {
          ...this.selectedOrder,
          ...orderData
        };
        
        this.editMode = false;
        this.updateSuccess = true;
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          this.updateSuccess = false;
        }, 3000);
      },
      (error) => {
        this.updateError = true;
        this.updateErrorMessage = 'Error updating order. Please try again.';
        console.error('Error updating order:', error);
      }
    );
  }
  
  deleteOrder(orderId: number): void {
    if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      this.adminService.deleteOrder(orderId).subscribe(
        () => {
          // Remove the order from the local array
          this.orders = this.orders.filter(order => order.id !== orderId);
          
          // If we're viewing the details of this order, close the modal
          if (this.selectedOrder && this.selectedOrder.id === orderId) {
            this.selectedOrder = null;
          }
        },
        (error) => {
          console.error('Error deleting order:', error);
          alert('Could not delete order. Please try again.');
        }
      );
    }
  }
} 