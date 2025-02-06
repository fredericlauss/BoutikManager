import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { UserRole } from '../../interfaces/user.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <a routerLink="/">BoutikManager</a>
      </div>
      
      @if (isLoggedIn) {
        <div class="nav-links">
          <a routerLink="/products" routerLinkActive="active">Products</a>
          
          @if (!isAdmin) {
            <a routerLink="/cart" routerLinkActive="active" class="cart-link">
              Cart
              @if (cartItemsCount > 0) {
                <span class="cart-badge">{{ cartItemsCount }}</span>
              }
            </a>
          }
          
          <a routerLink="/orders" routerLinkActive="active">Orders</a>
          
          <button (click)="logout()" class="logout-button">Logout</button>
        </div>
      } @else {
        <div class="nav-links">
          <a routerLink="/login" routerLinkActive="active">Login</a>
          <a routerLink="/register" routerLinkActive="active">Register</a>
        </div>
      }
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .nav-brand a {
      font-size: 1.5rem;
      font-weight: 600;
      color: #111827;
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.5rem;

      a {
        color: #4b5563;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;

        &:hover {
          color: #111827;
        }

        &.active {
          color: #6366f1;
        }
      }

      .cart-link {
        position: relative;
        
        .cart-badge {
          position: absolute;
          top: -8px;
          right: -12px;
          background-color: #ef4444;
          color: white;
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          min-width: 1.5rem;
          text-align: center;
        }
      }

      .logout-button {
        padding: 0.5rem 1rem;
        background-color: #ef4444;
        color: white;
        border: none;
        border-radius: 0.375rem;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
          background-color: #dc2626;
        }
      }
    }

    @media (max-width: 640px) {
      .navbar {
        padding: 1rem;
        flex-direction: column;
        gap: 1rem;
      }

      .nav-links {
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
      }
    }
  `]
})
export class NavbarComponent {
  isLoggedIn = false;
  isAdmin = false;
  cartItemsCount = 0;

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {
    this.authService.isAuthenticated$.subscribe(
      (isAuthenticated: boolean) => {
        this.isLoggedIn = isAuthenticated;
        if (isAuthenticated) {
          const user = this.authService.getCurrentUser();
          this.isAdmin = user?.role === UserRole.ADMIN;
        }
      }
    );

    this.cartService.getCart().subscribe(
      items => {
        this.cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);
      }
    );
  }

  logout(): void {
    this.authService.logout();
  }
} 