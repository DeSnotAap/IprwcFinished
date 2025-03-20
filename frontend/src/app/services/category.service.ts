import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Category, CategoryRequest } from '../models/book.model';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl + '/categories';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(API_URL)
      .pipe(
        timeout(10000), // 10 second timeout
        catchError(error => {
          console.error('Error fetching categories:', error);
          return throwError(() => new Error('Failed to load categories. Please try again.'));
        })
      );
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${API_URL}/${id}`)
      .pipe(
        timeout(10000),
        catchError(error => {
          console.error(`Error fetching category ${id}:`, error);
          return throwError(() => new Error('Failed to load category. Please try again.'));
        })
      );
  }

  createCategory(category: CategoryRequest): Observable<Category> {
    return this.http.post<Category>(API_URL, category);
  }

  updateCategory(id: number, category: CategoryRequest): Observable<Category> {
    return this.http.put<Category>(`${API_URL}/${id}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }
} 