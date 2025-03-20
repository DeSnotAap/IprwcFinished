import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Bookshop';
  
  constructor(
    private router: Router,
    public authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Check if token exists in localStorage
    const token = localStorage.getItem('auth-token');
    if (token) {
      // Token exists, user is logged in
      console.log('User is logged in with token');
    }

    console.log('Testing API connections...');
    
    // Pre-fetch categories for faster navigation
    this.http.get(environment.apiUrl + '/categories').subscribe(
      (data) => {
        console.log('Categories pre-fetched');
      },
      (error) => {
        console.error('Failed to pre-fetch categories:', error);
      }
    );
    
    // Pre-fetch books for faster navigation
    this.http.get(environment.apiUrl + '/books').subscribe(
      (data) => {
        console.log('Books pre-fetched');
      },
      (error) => {
        console.error('Failed to pre-fetch books:', error);
      }
    );
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get currentUser() {
    return this.authService.currentUserValue;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 