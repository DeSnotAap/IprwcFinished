package com.bookshop.services;

import com.bookshop.models.Book;
import com.bookshop.models.Category;
import com.bookshop.repositories.BookRepository;
import com.bookshop.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.util.List;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    public Book findById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + id));
    }

    public List<Book> findByCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + categoryId));
        return bookRepository.findByCategory(category);
    }

    public Book save(Book book) {
        if (book.getCategory() != null && book.getCategory().getId() != null) {
            Category category = categoryRepository.findById(book.getCategory().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + book.getCategory().getId()));
            book.setCategory(category);
        }
        return bookRepository.save(book);
    }

    public Book update(Long id, Book updatedBook) {
        Book existingBook = findById(id);
        
        existingBook.setTitle(updatedBook.getTitle());
        existingBook.setAuthor(updatedBook.getAuthor());
        existingBook.setDescription(updatedBook.getDescription());
        existingBook.setPrice(updatedBook.getPrice());
        existingBook.setImageUrl(updatedBook.getImageUrl());
        existingBook.setCategory(updatedBook.getCategory());
        existingBook.setPublishedDate(updatedBook.getPublishedDate());
        
        return bookRepository.save(existingBook);
    }

    public void delete(Long id) {
        bookRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return bookRepository.existsById(id);
    }

    // Pagination methods
    public Page<Book> findAllPaged(Pageable pageable) {
        return bookRepository.findAll(pageable);
    }
    
    public Page<Book> findByCategoryPaged(Long categoryId, Pageable pageable) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + categoryId));
        return bookRepository.findByCategory(category, pageable);
    }
} 