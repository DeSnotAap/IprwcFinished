package com.bookshop.controllers;

import com.bookshop.models.Book;
import com.bookshop.models.Category;
import com.bookshop.payload.request.BookRequest;
import com.bookshop.payload.response.BookResponse;
import com.bookshop.payload.response.MessageResponse;
import com.bookshop.services.BookService;
import com.bookshop.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/books")
public class BookController {
    @Autowired
    private BookService bookService;

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<?> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long categoryId) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Book> bookPage;
            
            if (categoryId != null) {
                // Filter by category only
                bookPage = bookService.findByCategoryPaged(categoryId, pageable);
            } else {
                // No filters, get all books
                bookPage = bookService.findAllPaged(pageable);
            }
            
            Page<BookResponse> bookResponsePage = bookPage.map(BookResponse::new);
            return ResponseEntity.ok(bookResponsePage);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> getBookById(@PathVariable Long id) {
        Book book = bookService.findById(id);
        return ResponseEntity.ok(new BookResponse(book));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<BookResponse>> getBooksByCategory(@PathVariable Long categoryId) {
        List<Book> books = bookService.findByCategory(categoryId);
        List<BookResponse> bookResponses = books.stream()
                .map(BookResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookResponses);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createBook(@Valid @RequestBody BookRequest bookRequest) {
        try {
            Book book = convertToEntity(bookRequest);
            Book savedBook = bookService.save(book);
            return ResponseEntity.ok(new BookResponse(savedBook));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateBook(@PathVariable Long id, @Valid @RequestBody BookRequest bookRequest) {
        if (!bookService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        try {
            Book book = convertToEntity(bookRequest);
            Book updatedBook = bookService.update(id, book);
            return ResponseEntity.ok(new BookResponse(updatedBook));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        bookService.delete(id);
        return ResponseEntity.ok(new MessageResponse("Book deleted successfully!"));
    }

    private Book convertToEntity(BookRequest bookRequest) {
        Book book = new Book();
        book.setTitle(bookRequest.getTitle());
        book.setAuthor(bookRequest.getAuthor());
        book.setDescription(bookRequest.getDescription());
        book.setPrice(bookRequest.getPrice());
        book.setImageUrl(bookRequest.getImageUrl());
        book.setPublishedDate(bookRequest.getPublishedDate());

        if (bookRequest.getCategoryId() != null) {
            Category category = categoryService.findById(bookRequest.getCategoryId());
            book.setCategory(category);
        }

        return book;
    }
} 