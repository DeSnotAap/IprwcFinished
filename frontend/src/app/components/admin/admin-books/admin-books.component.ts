import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { CategoryService } from '../../../services/category.service';
import { Book, Category, BookRequest, PageResponse } from '../../../models/book.model';

@Component({
  selector: 'app-admin-books',
  templateUrl: './admin-books.component.html',
  styleUrls: ['./admin-books.component.css']
})
export class AdminBooksComponent implements OnInit {
  books: Book[] = [];
  categories: Category[] = [];
  selectedBook: Book | null = null;
  isLoading = true;
  error = false;
  errorMessage = '';
  isAddingBook = false;
  isEditingBook = false;
  bookForm: FormGroup;
  formSubmitted = false;
  updateSuccess = false;
  updateError = false;
  updateErrorMessage = '';

  constructor(
    private adminService: AdminService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.bookForm = this.createBookForm();
  }

  ngOnInit(): void {
    this.loadBooks();
    this.loadCategories();
  }

  createBookForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      author: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(2000)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      imageUrl: [''],
      categoryId: [null],
      publishedDate: [null]
    });
  }

  loadBooks(): void {
    this.isLoading = true;
    this.error = false;
    
    // Save the current scroll position before refreshing
    const tableContainer = document.querySelector('.table-responsive');
    const scrollPosition = tableContainer ? tableContainer.scrollTop : 0;
    
    this.adminService.getAllBooks().subscribe(
      (response: PageResponse<Book>) => {
        console.log('API Response:', response);
        
        // Extract books from the paginated response
        if (response && response.content) {
          this.books = response.content;
          console.log('Extracted books array:', this.books);
        } else {
          console.error('Unexpected response format:', response);
          this.books = [];
          this.error = true;
          this.errorMessage = 'Error processing books data. Unexpected format.';
        }
        this.isLoading = false;
        
        // Restore scroll position after the data is loaded and view is updated
        setTimeout(() => {
          const refreshedTableContainer = document.querySelector('.table-responsive');
          if (refreshedTableContainer) {
            refreshedTableContainer.scrollTop = scrollPosition;
          }
        }, 100);
      },
      (error) => {
        this.isLoading = false;
        this.error = true;
        this.errorMessage = 'Error loading books. Please try again.';
        console.error('Error loading books:', error);
      }
    );
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  viewBookDetails(book: Book): void {
    this.selectedBook = book;
    this.isAddingBook = false;
    this.isEditingBook = false;
    this.updateSuccess = false;
    this.updateError = false;
  }

  closeBookDetails(): void {
    this.selectedBook = null;
    this.isAddingBook = false;
    this.isEditingBook = false;
    this.updateSuccess = false;
    this.updateError = false;
  }

  addNewBook(): void {
    this.selectedBook = null;
    this.isAddingBook = true;
    this.isEditingBook = false;
    this.bookForm.reset();
    this.formSubmitted = false;
    this.updateSuccess = false;
    this.updateError = false;
  }

  editBook(book: Book): void {
    this.selectedBook = book;
    this.isAddingBook = false;
    this.isEditingBook = true;
    this.formSubmitted = false;
    this.updateSuccess = false;
    this.updateError = false;
    
    // Convert publishedDate string to Date object if it exists
    const publishedDate = book.publishedDate ? new Date(book.publishedDate) : null;
    
    this.bookForm.patchValue({
      title: book.title,
      author: book.author,
      description: book.description || '',
      price: book.price,
      imageUrl: book.imageUrl || '',
      categoryId: book.categoryId || null,
      publishedDate: publishedDate ? publishedDate.toISOString().split('T')[0] : null
    });
  }

  cancelEdit(): void {
    if (this.selectedBook) {
      this.isEditingBook = false;
    } else {
      this.isAddingBook = false;
    }
  }

  saveBook(): void {
    this.formSubmitted = true;
    
    if (this.bookForm.invalid) {
      return;
    }
    
    const bookData: BookRequest = {
      title: this.bookForm.value.title,
      author: this.bookForm.value.author,
      description: this.bookForm.value.description,
      price: this.bookForm.value.price,
      imageUrl: this.bookForm.value.imageUrl,
      categoryId: this.bookForm.value.categoryId,
      publishedDate: this.bookForm.value.publishedDate ? new Date(this.bookForm.value.publishedDate) : undefined
    };
    
    if (this.isEditingBook && this.selectedBook) {
      this.adminService.updateBook(this.selectedBook.id, bookData).subscribe(
        (response) => {
          // Update the book in the local array
          const index = this.books.findIndex(book => book.id === this.selectedBook!.id);
          if (index !== -1) {
            this.books[index] = response;
          }
          
          this.selectedBook = response;
          this.isEditingBook = false;
          this.updateSuccess = true;
          this.updateError = false;
          
          setTimeout(() => {
            this.updateSuccess = false;
          }, 3000);
        },
        (error) => {
          console.error('Error updating book:', error);
          this.updateError = true;
          this.updateErrorMessage = error.error?.message || 'Error updating book. Please try again.';
        }
      );
    } else if (this.isAddingBook) {
      this.adminService.createBook(bookData).subscribe(
        (response) => {
          // Add the new book to the local array
          this.books.push(response);
          
          this.isAddingBook = false;
          this.updateSuccess = true;
          this.updateError = false;
          
          setTimeout(() => {
            this.updateSuccess = false;
          }, 3000);
        },
        (error) => {
          console.error('Error adding book:', error);
          this.updateError = true;
          this.updateErrorMessage = error.error?.message || 'Error adding book. Please try again.';
        }
      );
    }
  }

  deleteBook(bookId: number): void {
    if (confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      this.adminService.deleteBook(bookId).subscribe(
        () => {
          // Remove the book from the local array
          this.books = this.books.filter(book => book.id !== bookId);
          
          // If we're viewing the details of this book, close the modal
          if (this.selectedBook && this.selectedBook.id === bookId) {
            this.selectedBook = null;
          }
        },
        (error) => {
          console.error('Error deleting book:', error);
          alert('Could not delete book. Please try again.');
        }
      );
    }
  }

  getCategoryName(categoryId: number | undefined): string {
    if (!categoryId) return 'None';
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  }
}
