package com.bookshop.payload.response;

import com.bookshop.models.Book;
import com.bookshop.models.CartItem;

import java.math.BigDecimal;

public class CartItemResponse {
    private Long id;
    private Long bookId;
    private String title;
    private String author;
    private BigDecimal price;
    private Integer quantity;
    private String imageUrl;
    private BigDecimal subtotal;
    
    public CartItemResponse(CartItem cartItem) {
        this.id = cartItem.getId();
        
        Book book = cartItem.getBook();
        this.bookId = book.getId();
        this.title = book.getTitle();
        this.author = book.getAuthor();
        this.price = book.getPrice();
        this.imageUrl = book.getImageUrl();
        
        this.quantity = cartItem.getQuantity();
        this.subtotal = cartItem.getItemTotal();
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getBookId() {
        return bookId;
    }
    
    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getAuthor() {
        return author;
    }
    
    public void setAuthor(String author) {
        this.author = author;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public BigDecimal getSubtotal() {
        return subtotal;
    }
    
    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
} 