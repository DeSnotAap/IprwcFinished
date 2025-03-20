import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { Book, BookRequest } from '../models/book.model';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl + '/books';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) { }

  getBooks(page: number = 0, size: number = 10, categoryId?: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (categoryId) {
      params = params.set('categoryId', categoryId.toString());
    }
    
    return this.http.get<any>(API_URL, { params })
      .pipe(
        timeout(10000),
        catchError(error => {
          console.error('Error fetching books:', error);
          return throwError(() => new Error('Failed to load books. Please try again.'));
        })
      );
  }

  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${API_URL}/${id}`)
      .pipe(
        timeout(10000),
        catchError(error => {
          console.error(`Error fetching book ${id}:`, error);
          return throwError(() => new Error('Failed to load book. Please try again.'));
        })
      );
  }

  createBook(book: BookRequest): Observable<Book> {
    return this.http.post<Book>(API_URL, book);
  }

  updateBook(id: number, book: BookRequest): Observable<Book> {
    return this.http.put<Book>(`${API_URL}/${id}`, book);
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }

  getFeaturedBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${API_URL}/featured`);
  }

  getBooksByCategory(categoryId: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${API_URL}/category/${categoryId}`)
      .pipe(
        timeout(10000),
        catchError(error => {
          console.error(`Error fetching books for category ${categoryId}:`, error);
          return throwError(() => new Error('Failed to load books for this category. Please try again.'));
        })
      );
  }
} 