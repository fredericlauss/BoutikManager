import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { UserRole } from '../../interfaces/user.interface';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  errorMessage = '';
  isAdmin = false;
  quantities: { [key: number]: number } = {};

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {
    const user = this.authService.getCurrentUser();
    this.isAdmin = user?.role === UserRole.ADMIN;
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        // Initialiser les quantités à 1 pour chaque produit
        this.products.forEach(product => {
          this.quantities[product.id] = 1;
        });
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Failed to load products. Please try again.';
      }
    });
  }

  increaseQuantity(product: Product): void {
    if (this.quantities[product.id] < product.stock) {
      this.quantities[product.id]++;
    }
  }

  decreaseQuantity(product: Product): void {
    if (this.quantities[product.id] > 1) {
      this.quantities[product.id]--;
    }
  }

  addToCart(product: Product): void {
    const quantity = this.quantities[product.id];
    if (quantity > 0 && quantity <= product.stock) {
      this.cartService.addToCart(product, quantity);
      this.quantities[product.id] = 1;
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (error) => {
          console.error('Error deleting product:', error);
          this.errorMessage = 'Error deleting product. Please try again.';
        }
      });
    }
  }

  editProduct(id: number): void {
    this.router.navigate(['/products/edit', id]);
  }
} 