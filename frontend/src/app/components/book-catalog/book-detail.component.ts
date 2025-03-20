import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  loading = true;
  error = false;
  quantity = 1;
  addingToCart = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private cartService: CartService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const bookId = Number(params.get('id'));
      if (bookId) {
        this.loadBook(bookId);
      }
    });
  }

  loadBook(id: number): void {
    this.loading = true;
    this.error = false;
    
    this.bookService.getBook(id).subscribe(
      (data) => {
        this.book = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching book details:', error);
        this.loading = false;
        this.error = true;
      }
    );
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  addToCart(): void {
    if (!this.authService.isLoggedIn()) {
      // Redirect to login if not logged in
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: this.router.url } 
      });
      return;
    }

    if (this.book && !this.addingToCart) {
      this.addingToCart = true;
      
      this.cartService.addToCart(this.book.id, this.quantity).subscribe(
        (response) => {
          this.addingToCart = false;
          alert(`Added ${this.quantity} of "${this.book?.title}" to your cart.`);
          // Reset quantity to 1 after adding to cart
          this.quantity = 1;
        },
        (error) => {
          this.addingToCart = false;
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
} 