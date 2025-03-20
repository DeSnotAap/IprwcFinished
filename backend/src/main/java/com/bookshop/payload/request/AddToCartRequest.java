package com.bookshop.payload.request;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

public class AddToCartRequest {
    @NotNull
    private Long bookId;
    
    @NotNull
    @Min(1)
    private Integer quantity;
    
    public AddToCartRequest() {
    }
    
    public Long getBookId() {
        return bookId;
    }
    
    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
} 