package com.bookshop.controllers;

import com.bookshop.models.Order;
import com.bookshop.payload.request.OrderRequest;
import com.bookshop.payload.request.OrderUpdateRequest;
import com.bookshop.payload.response.MessageResponse;
import com.bookshop.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/orders")
public class OrderController {
    
    private final OrderService orderService;
    
    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderRequest orderRequest, Authentication authentication) {
        try {
            Order order = orderService.createOrder(orderRequest, authentication.getName());
            return ResponseEntity.ok(order);
        } catch (IllegalStateException ise) {
            // Specific error for empty cart
            return ResponseEntity.badRequest().body(new MessageResponse(ise.getMessage()));
        } catch (Exception e) {
            // Log the error for debugging
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new MessageResponse("Error creating order: " + e.getMessage()));
        }
    }
    
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getOrders(Authentication authentication) {
        try {
            // Check if user is admin
            if (authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                // Return all orders for admin users
                List<Order> orders = orderService.getAllOrders();
                return ResponseEntity.ok(orders);
            } else {
                // Return only user's orders for regular users
                List<Order> orders = orderService.getOrdersForUser(authentication.getName());
                return ResponseEntity.ok(orders);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getOrderById(@PathVariable Long id, Authentication authentication) {
        try {
            Order order = orderService.getOrderById(id, authentication.getName());
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody OrderStatusRequest statusRequest) {
        try {
            Order updatedOrder = orderService.updateOrderStatus(id, statusRequest.getStatus());
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateOrder(@PathVariable Long id, @RequestBody OrderUpdateRequest updateRequest) {
        try {
            Order updatedOrder = orderService.updateOrder(id, updateRequest);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.ok(new MessageResponse("Order deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error deleting order: " + e.getMessage()));
        }
    }
    
    // Request class for order status updates
    public static class OrderStatusRequest {
        private String status;
        
        public String getStatus() {
            return status;
        }
        
        public void setStatus(String status) {
            this.status = status;
        }
    }
} 