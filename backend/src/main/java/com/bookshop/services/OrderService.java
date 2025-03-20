package com.bookshop.services;

import com.bookshop.models.*;
import com.bookshop.payload.request.OrderRequest;
import com.bookshop.payload.request.OrderUpdateRequest;
import com.bookshop.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final UserService userService;
    
    @Autowired
    public OrderService(OrderRepository orderRepository, CartService cartService, UserService userService) {
        this.orderRepository = orderRepository;
        this.cartService = cartService;
        this.userService = userService;
    }
    
    @Transactional
    public Order createOrder(OrderRequest orderRequest, String username) {
        try {
            if (username == null || username.isEmpty()) {
                throw new IllegalArgumentException("Username cannot be null or empty");
            }
            
            User user = userService.getUserByUsername(username);
            if (user == null) {
                throw new IllegalArgumentException("User not found with username: " + username);
            }
            
            Cart cart = cartService.getCartForUser(user);
            if (cart == null) {
                throw new IllegalStateException("Cart not found for user: " + username);
            }
            
            // Create a new order 
            Order order = new Order();
            order.setUser(user);
            
            // Set basic order information
            order.setFirstName(orderRequest.getFirstName() != null ? orderRequest.getFirstName() : "");
            order.setLastName(orderRequest.getLastName() != null ? orderRequest.getLastName() : "");
            order.setEmail(orderRequest.getEmail() != null ? orderRequest.getEmail() : "");
            order.setAddress(orderRequest.getAddress() != null ? orderRequest.getAddress() : "");
            
            // Set default dates
            LocalDateTime now = LocalDateTime.now();
            order.setOrderDate(now);
            order.setCreatedAt(now);
            order.setUpdatedAt(now);
            
            List<OrderItem> orderItems = new ArrayList<>();
            BigDecimal totalPrice = BigDecimal.ZERO;
            int totalQuantity = 0;
            
            // Process cart items if available
            if (cart.getItems() != null && !cart.getItems().isEmpty()) {
                for (CartItem cartItem : cart.getItems()) {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order);
                    
                    // Set book if available, or use defaults
                    if (cartItem.getBook() != null) {
                        orderItem.setBook(cartItem.getBook());
                        orderItem.setTitle(cartItem.getBook().getTitle());
                        orderItem.setPrice(cartItem.getBook().getPrice());
                    }
                    
                    // Set quantity, default to 1 if not valid
                    int quantity = Math.max(1, cartItem.getQuantity());
                    orderItem.setQuantity(quantity);
                    totalQuantity += quantity;
                    
                    // Calculate item total
                    BigDecimal itemPrice = orderItem.getPrice() != null ? orderItem.getPrice() : BigDecimal.ZERO;
                    BigDecimal itemTotal = itemPrice.multiply(new BigDecimal(quantity));
                    orderItem.setItemTotal(itemTotal);
                    
                    orderItems.add(orderItem);
                    totalPrice = totalPrice.add(itemTotal);
                }
            }
            
            // Set the items
            order.setItems(orderItems);
            order.setTotalPrice(totalPrice);
            order.setTotalQuantity(totalQuantity);
            order.setStatus(Order.OrderStatus.PENDING);
            
            // Save order and clear cart
            Order savedOrder = orderRepository.save(order);
            
            // Try to clear the cart, but don't fail if there's an issue
            try {
                cartService.clearCart(user);
            } catch (Exception e) {
                // Just log the error, don't fail the order
                System.err.println("Could not clear cart: " + e.getMessage());
            }
            
            return savedOrder;
        } catch (Exception e) {
            // For a proof of concept, log the error and throw a simplified version
            e.printStackTrace();
            throw new RuntimeException("Could not create order: " + e.getMessage());
        }
    }
    
    public List<Order> getOrdersForUser(String username) {
        User user = userService.getUserByUsername(username);
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }
    
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    public Order getOrderById(Long orderId, String username) {
        User user = userService.getUserByUsername(username);
        return orderRepository.findById(orderId)
                .filter(order -> order.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new IllegalArgumentException("Order not found or not authorized"));
    }
    
    @Transactional
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));
        
        try {
            Order.OrderStatus newStatus = Order.OrderStatus.valueOf(status.toUpperCase());
            order.setStatus(newStatus);
            order.setUpdatedAt(LocalDateTime.now());
            return orderRepository.save(order);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid order status: " + status);
        }
    }
    
    @Transactional
    public Order updateOrder(Long orderId, OrderUpdateRequest updateRequest) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));
        
        // Update basic order information if provided
        if (updateRequest.getFirstName() != null) {
            order.setFirstName(updateRequest.getFirstName());
        }
        
        if (updateRequest.getLastName() != null) {
            order.setLastName(updateRequest.getLastName());
        }
        
        if (updateRequest.getEmail() != null) {
            order.setEmail(updateRequest.getEmail());
        }
        
        if (updateRequest.getAddress() != null) {
            order.setAddress(updateRequest.getAddress());
        }
        
        if (updateRequest.getStatus() != null) {
            try {
                Order.OrderStatus newStatus = Order.OrderStatus.valueOf(updateRequest.getStatus().toUpperCase());
                order.setStatus(newStatus);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid order status: " + updateRequest.getStatus());
            }
        }
        
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }
    
    @Transactional
    public void deleteOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));
        
        // Delete the order
        orderRepository.delete(order);
    }
} 