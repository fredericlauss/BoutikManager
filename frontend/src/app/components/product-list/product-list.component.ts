import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Products</h1>
        <button routerLink="/products/new" class="bg-blue-500 text-white px-4 py-2 rounded">
          Add Product
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (product of products; track product.id) {
          <div class="border rounded-lg p-4 shadow">
            <img [src]="product.imageUrl || 'assets/placeholder.png'" 
                 [alt]="product.name"
                 class="w-full h-48 object-cover mb-4">
            <h2 class="text-xl font-semibold">{{ product.name }}</h2>
            <p class="text-gray-600">{{ product.description }}</p>
            <div class="mt-4 flex justify-between items-center">
              <span class="text-lg font-bold">€{{ product.price }}</span>
              <span class="text-sm text-gray-500">Stock: {{ product.stock }}</span>
            </div>
            <div class="mt-4 flex justify-end gap-2">
              <button (click)="editProduct(product.id)" 
                      class="bg-yellow-500 text-white px-3 py-1 rounded">
                Edit
              </button>
              <button (click)="deleteProduct(product.id)" 
                      class="bg-red-500 text-white px-3 py-1 rounded">
                Delete
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => this.products = products,
      error: (error) => console.error('Error loading products:', error)
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (error) => console.error('Error deleting product:', error)
      });
    }
  }

  editProduct(id: number): void {
    // Navigation will be handled by router
  }
} 