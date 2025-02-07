import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { Order } from '../../interfaces/order.interface';
import { Product } from '../../interfaces/product.interface';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('salesChart') salesChart!: ElementRef;
  
  totalOrders = 0;
  lowStockProducts: Product[] = [];
  chart: Chart | null = null;

  constructor(
    private orderService: OrderService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  ngAfterViewInit() {
    // Le graphique sera initialisé une fois que les données seront chargées
  }

  private loadDashboardData() {
    // Charger les commandes
    this.orderService.getAllOrders().subscribe(orders => {
      this.totalOrders = orders.length;
      this.calculateTopProducts(orders);
    });

    // Charger les produits pour le stock
    this.productService.getProducts().subscribe(products => {
      this.lowStockProducts = products
        .filter(product => product.stock < 10)
        .sort((a, b) => a.stock - b.stock);
    });
  }

  private calculateTopProducts(orders: Order[]) {
    const productSales = new Map<string, number>();

    // Calculer les ventes totales par produit
    orders.forEach(order => {
      order.items.forEach(item => {
        const currentSales = productSales.get(item.product.name) || 0;
        productSales.set(item.product.name, currentSales + item.quantity);
      });
    });

    // Convertir en format pour chart.js
    const topProducts = Array.from(productSales.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Top 5 produits

    const labels = topProducts.map(([name]) => name);
    const data = topProducts.map(([, value]) => value);

    this.initChart(labels, data);
  }

  private initChart(labels: string[], data: number[]) {
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.salesChart.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Sales',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }
} 