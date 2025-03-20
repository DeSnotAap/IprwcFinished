package com.bookshop.payload.request;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

public class UpdateCartItemRequest {
    @NotNull
    @Min(1)
    private Integer quantity;
    
    public UpdateCartItemRequest() {
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
} 