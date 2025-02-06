import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../interfaces/order.interface';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../interfaces/user.interface';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="orders-container">
      <div class="orders-box">
        <div class="orders-header">
          <h1>My Orders</h1>
        </div>

        @if (errorMessage) {
          <div class="error-message">
            {{ errorMessage }}
          </div>
        }

        @if (orders.length) {
          <div class="orders-list">
            @for (order of orders; track order.id) {
              <div class="order-card">
                <div class="order-header">
                  <span class="order-number">Order #{{ order.id }}</span>
                  <span class="order-date">{{ order.createdAt | date:'medium' }}</span>
                </div>

                <div class="order-items">
                  @for (item of order.items; track item.id) {
                    <div class="order-item">
                      <img [src]="item.product.imageUrl || 'assets/placeholder.png'" 
                           [alt]="item.product.name">
                      <div class="item-details">
                        <span class="item-name">{{ item.product.name }}</span>
                        <span class="item-quantity">Quantity: {{ item.quantity }}</span>
                        <span class="item-price">€{{ item.product.price * item.quantity }}</span>
                      </div>
                    </div>
                  }
                </div>

                <div class="order-footer">
                  <div class="status" [class]="order.status.toLowerCase()">
                    {{ order.status }}
                  </div>
                  @if (isAdmin && order.status === 'PENDING') {
                    <div class="admin-actions">
                      <button (click)="updateStatus(order.id, OrderStatus.SHIPPED)"
                              class="ship-button">
                        Mark as Shipped
                      </button>
                      <button (click)="updateStatus(order.id, OrderStatus.CANCELLED)"
                              class="cancel-button">
                        Cancel Order
                      </button>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="no-orders">
            <p>No orders found.</p>
            <button routerLink="/products">Start Shopping</button>
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  errorMessage = '';
  isAdmin = false;
  OrderStatus = OrderStatus; // Pour utiliser l'enum dans le template

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {
    const user = this.authService.getCurrentUser();
    this.isAdmin = user?.role === UserRole.ADMIN;
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.errorMessage = 'Failed to load orders. Please try again.';
      }
    });
  }

  updateStatus(orderId: number, status: OrderStatus): void {
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: (updatedOrder) => {
        const index = this.orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        this.errorMessage = 'Failed to update order status. Please try again.';
      }
    });
  }
} 