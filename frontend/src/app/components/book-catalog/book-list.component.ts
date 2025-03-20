import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Book, Category } from '../../models/book.model';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  loading = false;
  addingToCart: { [key: number]: boolean } = {};
  
  // Pagination
  currentPage = 0;
  pageSize = 12;
  totalItems = 0;
  totalPages = 0;

  constructor(
    private router: Router,
    private bookService: BookService,
    private categoryService: CategoryService,
    private cartService: CartService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadBooks();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      data => {
        this.categories = data;
      },
      error => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.getBooks(
      this.currentPage,
      this.pageSize,
      this.selectedCategoryId || undefined
    ).subscribe(
      data => {
        this.books = data.content;
        this.totalItems = data.totalElements;
        this.totalPages = data.totalPages;
        this.loading = false;
      },
      error => {
        console.error('Error fetching books:', error);
        this.loading = false;
      }
    );
  }

  selectCategory(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.currentPage = 0;
    this.loadBooks();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadBooks();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadBooks();
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadBooks();
    }
  }

  getPageNumbers(): number[] {
    const pages = [];
    const startPage = Math.max(0, this.currentPage - 2);
    const endPage = Math.min(this.totalPages - 1, this.currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  addToCart(book: Book): void {
    if (!this.authService.isLoggedIn()) {
      // Redirect to login if not logged in
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: this.router.url } 
      });
      return;
    }

    if (!this.addingToCart[book.id]) {
      this.addingToCart[book.id] = true;
      
      this.cartService.addToCart(book.id, 1).subscribe(
        (response) => {
          this.addingToCart[book.id] = false;
          alert(`Added "${book.title}" to your cart.`);
        },
        (error) => {
          this.addingToCart[book.id] = false;
          console.error('Error adding to cart:', error);
          
          if (error.status === 401) {
            // Unauthorized, redirect to login
            this.router.navigate(['/login'], { 
              queryParams: { returnUrl: this.router.url } 
            });
          } else {
            alert('Failed to add item to cart. Please try again.');
          }
        }
      );
    }
  }

  isAddingToCart(bookId: number): boolean {
    return this.addingToCart[bookId] === true;
  }
} 