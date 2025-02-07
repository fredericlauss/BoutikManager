import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../interfaces/order.interface';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  OrderStatus = OrderStatus; // Pour utiliser l'enum dans le template

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe(
      orders => {
        this.orders = orders;
      }
    );
  }

  updateStatus(orderId: number, status: OrderStatus) {
    this.orderService.updateOrderStatus(orderId, status).subscribe(
      () => {
        this.loadOrders(); // Recharger la liste après la mise à jour
      }
    );
  }
} 