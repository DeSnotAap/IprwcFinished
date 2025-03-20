package com.bookshop.payload.request;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

public class OrderRequest {
    @NotBlank
    private String firstName = "";
    
    @NotBlank
    private String lastName = "";
    
    @NotBlank
    @Email
    private String email = "";
    
    @NotBlank
    private String address = "";
    
    // Getters and setters
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
} 