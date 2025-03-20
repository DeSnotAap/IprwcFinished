import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeholder',
  template: `
    <div class="placeholder-container">
      <div class="placeholder-content">
        <h2>{{ title }}</h2>
        <p>This feature will be available soon.</p>
        <button routerLink="/books" class="btn-primary">Back to Catalog</button>
      </div>
    </div>
  `,
  styles: [`
    .placeholder-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
    }
    .placeholder-content {
      background-color: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
      max-width: 500px;
      width: 100%;
    }
    h2 {
      color: #8B0000;
      margin-bottom: 1rem;
    }
    p {
      margin-bottom: 2rem;
      color: #666;
    }
    .btn-primary {
      background-color: #8B0000;
      color: white;
      border: none;
      padding: 0.6rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s ease;
    }
    .btn-primary:hover {
      background-color: #6b0000;
    }
  `]
})
export class PlaceholderComponent implements OnInit {
  title: string = 'Coming Soon';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if (data && data['title']) {
        this.title = data['title'];
      }
    });
  }
} 