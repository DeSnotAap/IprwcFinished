import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Book, PageResponse } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Orders management
  getAllOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders`);
  }

  updateOrderStatus(orderId: number, statusData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${orderId}/status`, statusData);
  }

  updateOrder(orderId: number, orderData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${orderId}`, orderData);
  }

  getOrderDetails(orderId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/${orderId}`);
  }

  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/orders/${orderId}`);
  }

  // User management
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  getUserDetails(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}`);
  }

  updateUserRole(userId: number, roleData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}`, roleData);
  }

  updateUserDetails(userId: number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}`, userData);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }

  // Book management
  getAllBooks(page: number = 0, size: number = 1000): Observable<PageResponse<Book>> {
    return this.http.get<PageResponse<Book>>(`${this.apiUrl}/books?page=${page}&size=${size}`);
  }

  createBook(bookData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/books`, bookData);
  }

  updateBook(bookId: number, bookData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/books/${bookId}`, bookData);
  }

  deleteBook(bookId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/books/${bookId}`);
  }
} 