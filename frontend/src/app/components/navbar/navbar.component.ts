import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <a routerLink="/products" class="brand">
          E-commerce
        </a>
        
        <div class="nav-actions">
          <span class="user-email">{{ userEmail }}</span>
          <button (click)="logout()" class="logout-button">
            Logout
          </button>
        </div>
      </div>
    </nav>
  `,
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  userEmail: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    const user = this.authService.getCurrentUser();
    this.userEmail = user?.email || '';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 