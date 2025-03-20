package com.bookshop.controllers;

import com.bookshop.models.Role;
import com.bookshop.models.User;
import com.bookshop.payload.response.MessageResponse;
import com.bookshop.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = optionalUser.get();
        User currentUser = userRepository.findByUsername(currentUsername).orElse(null);
        
        // Check if the user is trying to access their own profile or is an admin
        if (currentUser != null && (currentUser.getRole() == Role.ADMIN || currentUser.getId().equals(user.getId()))) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(403).body(new MessageResponse("Access denied"));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = optionalUser.get();
        User currentUser = userRepository.findByUsername(currentUsername).orElse(null);
        
        // Check if the user is trying to update their own profile or is an admin
        if (currentUser != null && (currentUser.getRole() == Role.ADMIN || currentUser.getId().equals(user.getId()))) {
            // Update only allowed fields
            if (updates.containsKey("firstName")) {
                user.setFirstName((String) updates.get("firstName"));
            }
            if (updates.containsKey("lastName")) {
                user.setLastName((String) updates.get("lastName"));
            }
            if (updates.containsKey("address")) {
                user.setAddress((String) updates.get("address"));
            }
            if (updates.containsKey("password")) {
                user.setPassword(encoder.encode((String) updates.get("password")));
            }
            
            // Allow admin to update username
            if (currentUser.getRole() == Role.ADMIN && updates.containsKey("username")) {
                String newUsername = (String) updates.get("username");
                // Check if username already exists
                if (!newUsername.equals(user.getUsername()) && userRepository.existsByUsername(newUsername)) {
                    return ResponseEntity.badRequest().body(new MessageResponse("Username is already taken"));
                }
                user.setUsername(newUsername);
            }
            
            // Only admin can change roles
            if (currentUser.getRole() == Role.ADMIN && updates.containsKey("role")) {
                try {
                    user.setRole(Role.valueOf((String) updates.get("role")));
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body(new MessageResponse("Invalid role"));
                }
            }
            
            userRepository.save(user);
            return ResponseEntity.ok(new MessageResponse("User updated successfully"));
        } else {
            return ResponseEntity.status(403).body(new MessageResponse("Access denied"));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            // Check if user exists
            if (!userRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            
            // Get user to check if it's a special protected user
            User user = userRepository.findById(id).orElse(null);
            if (user != null && "admin".equals(user.getUsername())) {
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Cannot delete the main admin user"));
            }
            
            // The database will automatically set user_id to NULL in related tables
            // because of the ON DELETE SET NULL constraint we added
            userRepository.deleteById(id);
            
            return ResponseEntity.ok(new MessageResponse("User deleted successfully"));
        } catch (Exception e) {
            // Log the error for debugging
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(new MessageResponse("Error deleting user: " + e.getMessage()));
        }
    }
} 