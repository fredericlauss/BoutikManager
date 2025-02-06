import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
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
        const formattedProduct = {
          ...product,
          price: product.price.toString().replace('.', ',')
        };
        this.productForm.patchValue(formattedProduct);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error loading product';
      }
    });
  }

  priceValidator() {
    return (control: any) => {
      if (!control.value) {
        return null;
      }
      const isValid = /^\d+(?:,\d{0,2})?$/.test(control.value);
      return isValid ? null : { invalidFormat: true };
    };
  }

  formatPrice() {
    const priceControl = this.productForm.get('price');
    if (priceControl && priceControl.value) {
      const value = priceControl.value.replace(',', '.');
      const formatted = Number(value).toFixed(2).replace('.', ',');
      priceControl.setValue(formatted, { emitEvent: false });
    }
  }

  showError(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.errorMessage = '';
      const formData = this.productForm.value;
      
      const product = {
        ...formData,
        price: Number(formData.price.replace(',', '.'))
      };
      
      if (this.isEditing && this.productId) {
        this.productService.updateProduct(this.productId, product).subscribe({
          next: () => this.router.navigate(['/products']),
          error: (error) => {
            this.errorMessage = error.error?.message || 'Error updating product';
          }
        });
      } else {
        this.productService.createProduct(product).subscribe({
          next: () => this.router.navigate(['/products']),
          error: (error) => {
            this.errorMessage = error.error?.message || 'Error creating product';
          }
        });
      }
    } else {
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }
} 