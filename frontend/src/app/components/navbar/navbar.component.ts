import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { UserRole } from '../../interfaces/user.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  cartItemsCount = 0;

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {
    // Vérifier immédiatement l'état d'authentification
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      const user = this.authService.getCurrentUser();
      this.isAdmin = user?.role === UserRole.ADMIN;
      if (!this.isAdmin) {
        this.subscribeToCart();
      }
    }
  }

  ngOnInit() {
    // S'abonner aux changements d'état d'authentification
    this.authService.isAuthenticated$.subscribe(
      (isAuthenticated: boolean) => {
        console.log('Auth state changed:', isAuthenticated); // Debug log
        this.isLoggedIn = isAuthenticated;
        if (isAuthenticated) {
          const user = this.authService.getCurrentUser();
          this.isAdmin = user?.role === UserRole.ADMIN;
          if (!this.isAdmin) {
            this.subscribeToCart();
          }
        } else {
          this.isAdmin = false;
          this.cartItemsCount = 0;
        }
      }
    );
  }

  private subscribeToCart(): void {
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