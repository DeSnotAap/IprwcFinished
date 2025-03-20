import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Category, Book } from '../../models/book.model';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  categoryBooks: Map<number, Book[]> = new Map();
  loading = true;
  error = false;
  addingToCart: { [key: number]: boolean } = {};

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private bookService: BookService,
    private cartService: CartService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = false;
    
    this.categoryService.getCategories().pipe(
      switchMap(categories => {
        this.categories = categories;
        
        // If no categories, return empty array
        if (categories.length === 0) {
          return of([]);
        }
        
        // Create an array of observables for all categories' books
        const bookRequests = categories.map(category => 
          this.bookService.getBooksByCategory(category.id).pipe(
            catchError(() => of([]))
          )
        );
        
        return forkJoin(bookRequests);
      }),
      catchError(error => {
        console.error('Error loading categories:', error);
        this.error = true;
        return of([]);
      })
    ).subscribe(
      booksArrays => {
        // Associate each array of books with its category
        this.categories.forEach((category, index) => {
          if (booksArrays[index]) {
            this.categoryBooks.set(category.id, booksArrays[index]);
          }
        });
        
        this.loading = false;
      },
      () => {
        this.loading = false;
        this.error = true;
      }
    );
  }

  getBooksForCategory(categoryId: number): Book[] {
    return this.categoryBooks.get(categoryId) || [];
  }

  hasBooksInCategory(categoryId: number): boolean {
    const books = this.categoryBooks.get(categoryId);
    return books !== undefined && books.length > 0;
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