package com.bookshop.services;

import com.bookshop.models.Book;
import com.bookshop.models.Cart;
import com.bookshop.models.CartItem;
import com.bookshop.models.User;
import com.bookshop.repositories.BookRepository;
import com.bookshop.repositories.CartItemRepository;
import com.bookshop.repositories.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private CartItemRepository cartItemRepository;
    
    @Autowired
    private BookRepository bookRepository;
    
    /**
     * Get a user's cart, creating one if it doesn't exist
     */
    @Transactional
    public Cart getOrCreateCart(User user) {
        Optional<Cart> existingCart = cartRepository.findByUserId(user.getId());
        
        if (existingCart.isPresent()) {
            return existingCart.get();
        } else {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        }
    }
    
    /**
     * Get cart for a user - used by OrderService
     */
    @Transactional
    public Cart getCartForUser(User user) {
        return getOrCreateCart(user);
    }
    
    /**
     * Add a book to the cart
     */
    @Transactional
    public CartItem addToCart(User user, Long bookId, Integer quantity) {
        if (quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }
        
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + bookId));
        
        Cart cart = getOrCreateCart(user);
        
        Optional<CartItem> existingCartItem = cartItemRepository.findByCartIdAndBookId(cart.getId(), bookId);
        
        if (existingCartItem.isPresent()) {
            CartItem cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            return cartItemRepository.save(cartItem);
        } else {
            CartItem newCartItem = new CartItem();
            newCartItem.setCart(cart);
            newCartItem.setBook(book);
            newCartItem.setQuantity(quantity);
            return cartItemRepository.save(newCartItem);
        }
    }
    
    /**
     * Update cart item quantity
     */
    @Transactional
    public CartItem updateCartItemQuantity(User user, Long cartItemId, Integer quantity) {
        if (quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }
        
        Cart cart = getOrCreateCart(user);
        
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("Cart item not found with id: " + cartItemId));
        
        // Security check - make sure the cart item belongs to the user's cart
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new SecurityException("Cart item does not belong to the user's cart");
        }
        
        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }
    
    /**
     * Remove an item from the cart
     */
    @Transactional
    public void removeFromCart(User user, Long cartItemId) {
        Cart cart = getOrCreateCart(user);
        
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("Cart item not found with id: " + cartItemId));
        
        // Security check - make sure the cart item belongs to the user's cart
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new SecurityException("Cart item does not belong to the user's cart");
        }
        
        cartItemRepository.delete(cartItem);
    }
    
    /**
     * Get cart items for a user
     */
    public List<CartItem> getCartItems(User user) {
        Cart cart = getOrCreateCart(user);
        return cartItemRepository.findByCartId(cart.getId());
    }
    
    /**
     * Get cart count for a user
     */
    public int getCartItemCount(User user) {
        Cart cart = getOrCreateCart(user);
        return cart.getItemCount();
    }
    
    /**
     * Clear all items from a cart
     */
    @Transactional
    public void clearCart(User user) {
        Cart cart = getOrCreateCart(user);
        cart.getItems().clear();
        cartRepository.save(cart);
    }
} 