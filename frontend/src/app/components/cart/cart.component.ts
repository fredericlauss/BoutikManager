import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cart-container">
      <div class="cart-box">
        <div class="cart-header">
          <h1>Shopping Cart</h1>
        </div>

        @if (errorMessage) {
          <div class="error-message">
            {{ errorMessage }}
          </div>
        }

        @if (cartItems.length) {
          <div class="cart-items">
            @for (item of cartItems; track item.product.id) {
              <div class="cart-item">
                <img [src]="item.product.imageUrl || 'assets/placeholder.png'" [alt]="item.product.name">
                <div class="item-details">
                  <h3>{{ item.product.name }}</h3>
                  <p class="price">€{{ item.product.price }}</p>
                  <div class="quantity-controls">
                    <button (click)="decreaseQuantity(item)">-</button>
                    <span>{{ item.quantity }}</span>
                    <button (click)="increaseQuantity(item)">+</button>
                  </div>
                </div>
                <button class="remove-button" (click)="removeItem(item)">×</button>
              </div>
            }

            <div class="cart-summary">
              <div class="total">
                <span>Total:</span>
                <span>€{{ calculateTotal() }}</span>
              </div>
              <button class="checkout-button" (click)="checkout()">
                Place Order
              </button>
            </div>
          </div>
        } @else {
          <div class="empty-cart">
            <p>Your cart is empty</p>
            <button routerLink="/products">Continue Shopping</button>
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  errorMessage = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
    });
  }

  removeItem(item: CartItem): void {
    this.cartService.removeItem(item.product.id);
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.product.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.product.id, item.quantity - 1);
  }

  calculateTotal(): number {
    return this.cartItems.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0);
  }

  checkout(): void {
    const orderItems = this.cartItems.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }));

    this.orderService.createOrder(orderItems).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        console.error('Error creating order:', error);
        this.errorMessage = 'Failed to create order. Please try again.';
      }
    });
  }
} 