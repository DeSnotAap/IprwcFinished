package com.bookshop.repositories;

import com.bookshop.models.Book;
import com.bookshop.models.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByCategory(Category category);
    Page<Book> findByCategory(Category category, Pageable pageable);
    List<Book> findByCategoryId(Long categoryId);
} 