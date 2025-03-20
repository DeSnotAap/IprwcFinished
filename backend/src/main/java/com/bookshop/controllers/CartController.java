package com.bookshop.controllers;

import com.bookshop.models.CartItem;
import com.bookshop.models.User;
import com.bookshop.payload.request.AddToCartRequest;
import com.bookshop.payload.request.UpdateCartItemRequest;
import com.bookshop.payload.response.CartItemResponse;
import com.bookshop.payload.response.CartResponse;
import com.bookshop.payload.response.MessageResponse;
import com.bookshop.repositories.UserRepository;
import com.bookshop.security.services.UserDetailsImpl;
import com.bookshop.services.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get the current user's cart
     */
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CartResponse> getCart() {
        User user = getCurrentUser();
        List<CartItem> cartItems = cartService.getCartItems(user);
        CartResponse cartResponse = new CartResponse(cartService.getOrCreateCart(user), cartItems);
        return ResponseEntity.ok(cartResponse);
    }

    /**
     * Add an item to the cart
     */
    @PostMapping("/items")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CartItemResponse> addToCart(@Valid @RequestBody AddToCartRequest addToCartRequest) {
        User user = getCurrentUser();
        CartItem cartItem = cartService.addToCart(user, addToCartRequest.getBookId(), addToCartRequest.getQuantity());
        return ResponseEntity.ok(new CartItemResponse(cartItem));
    }

    /**
     * Update cart item quantity
     */
    @PutMapping("/items/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CartItemResponse> updateCartItemQuantity(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCartItemRequest updateCartItemRequest) {
        User user = getCurrentUser();
        CartItem cartItem = cartService.updateCartItemQuantity(user, id, updateCartItemRequest.getQuantity());
        return ResponseEntity.ok(new CartItemResponse(cartItem));
    }

    /**
     * Remove an item from the cart
     */
    @DeleteMapping("/items/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<MessageResponse> removeFromCart(@PathVariable Long id) {
        User user = getCurrentUser();
        cartService.removeFromCart(user, id);
        return ResponseEntity.ok(new MessageResponse("Item removed from cart successfully"));
    }

    /**
     * Get cart item count
     */
    @GetMapping("/count")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Integer>> getCartItemCount() {
        User user = getCurrentUser();
        int count = cartService.getCartItemCount(user);
        return ResponseEntity.ok(Map.of("count", count));
    }

    /**
     * Clear the cart
     */
    @DeleteMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<MessageResponse> clearCart() {
        User user = getCurrentUser();
        cartService.clearCart(user);
        return ResponseEntity.ok(new MessageResponse("Cart cleared successfully"));
    }

    /**
     * Helper method to get the current authenticated user
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
} 