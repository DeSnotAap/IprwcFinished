package com.bookshop.payload.response;

import com.bookshop.models.Cart;
import com.bookshop.models.CartItem;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

public class CartResponse {
    private Long id;
    private List<CartItemResponse> items;
    private int itemCount;
    private BigDecimal subtotal;
    
    public CartResponse(Cart cart, List<CartItem> cartItems) {
        this.id = cart.getId();
        this.items = cartItems.stream()
                .map(CartItemResponse::new)
                .collect(Collectors.toList());
        this.itemCount = cart.getItemCount();
        this.subtotal = cart.getSubtotal();
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public List<CartItemResponse> getItems() {
        return items;
    }
    
    public void setItems(List<CartItemResponse> items) {
        this.items = items;
    }
    
    public int getItemCount() {
        return itemCount;
    }
    
    public void setItemCount(int itemCount) {
        this.itemCount = itemCount;
    }
    
    public BigDecimal getSubtotal() {
        return subtotal;
    }
    
    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
} 