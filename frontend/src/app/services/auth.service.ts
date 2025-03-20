import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';
import { environment } from '../../environments/environment';

const AUTH_API = environment.apiUrl + '/auth/';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(loginRequest: LoginRequest): Observable<any> {
    return this.http.post(AUTH_API + 'login', loginRequest, httpOptions)
      .pipe(
        tap((response: any) => {
          this.saveToken(response.token);
          this.saveUser(response);
          this.currentUserSubject.next({
            id: response.id,
            username: response.username,
            email: response.email,
            role: response.role,
            firstName: response.firstName,
            lastName: response.lastName,
            address: response.address
          });
        })
      );
  }

  register(registerRequest: RegisterRequest): Observable<any> {
    return this.http.post(AUTH_API + 'register', registerRequest, httpOptions);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSubject.next(null);
  }

  saveToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  saveUser(user: any): void {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUserFromStorage(): User | null {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user !== null && user.role === 'ADMIN';
  }
} 