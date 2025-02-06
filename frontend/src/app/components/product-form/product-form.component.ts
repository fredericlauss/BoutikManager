import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-6">{{ isEditing ? 'Edit' : 'Add' }} Product</h1>
      
      @if (errorMessage) {
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span class="block sm:inline">{{ errorMessage }}</span>
        </div>
      }
      
      <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="max-w-lg">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input type="text" formControlName="name"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <textarea formControlName="description"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </textarea>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Price (€)</label>
          <input type="text" formControlName="price"
                 (blur)="formatPrice()"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          @if (productForm.get('price')?.errors?.['invalidFormat']) {
            <p class="text-red-500 text-xs mt-1">Please enter a valid price (e.g., 12,99)</p>
          }
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Stock</label>
          <input type="number" formControlName="stock"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
          <input type="text" formControlName="imageUrl"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </div>

        <div class="flex justify-end gap-2">
          <button type="button" (click)="cancel()"
                  class="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
          <button type="submit" [disabled]="!productForm.valid"
                  class="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300">
            {{ isEditing ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditing = false;
  productId?: number;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, this.priceValidator()]],
      stock: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.productId) {
      this.isEditing = true;
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        // Convertir le prix en format français
        const formattedProduct = {
          ...product,
          price: product.price.toString().replace('.', ',')
        };
        this.productForm.patchValue(formattedProduct);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error loading product';
        console.error('Error loading product:', error);
      }
    });
  }

  priceValidator() {
    return (control: any) => {
      if (!control.value) {
        return null;
      }
      
      // Accepte les formats: 12,99 ou 12
      const isValid = /^\d+(?:,\d{0,2})?$/.test(control.value);
      return isValid ? null : { invalidFormat: true };
    };
  }

  formatPrice() {
    const priceControl = this.productForm.get('price');
    if (priceControl && priceControl.value) {
      // Formater le prix avec exactement 2 décimales
      const value = priceControl.value.replace(',', '.');
      const formatted = Number(value).toFixed(2).replace('.', ',');
      priceControl.setValue(formatted, { emitEvent: false });
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.errorMessage = ''; // Reset error message
      const formData = this.productForm.value;
      
      // Convertir le prix en format anglais pour l'API
      const product = {
        ...formData,
        price: Number(formData.price.replace(',', '.'))
      };
      
      if (this.isEditing && this.productId) {
        this.productService.updateProduct(this.productId, product).subscribe({
          next: () => this.router.navigate(['/products']),
          error: (error) => {
            this.errorMessage = error.error?.message || 'Error updating product';
            console.error('Error updating product:', error);
          }
        });
      } else {
        this.productService.createProduct(product).subscribe({
          next: () => this.router.navigate(['/products']),
          error: (error) => {
            this.errorMessage = error.error?.message || 'Error creating product';
            console.error('Error creating product:', error);
          }
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }
} 