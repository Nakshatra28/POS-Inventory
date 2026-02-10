import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-editproduct',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './editproduct.component.html',
  styleUrls: ['./editproduct.component.css'],
})
export class EditproductComponent {
  @Output() toast = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();
  @Input() data: any = null;

  constructor(private api: ApiService) {}

  product: any = {};

  ngOnChanges() {
    if (this.data) {
      this.product = { ...this.data }; 
    }
  }

  closeEdit() {
    this.close.emit();
  }

  saveProduct() {
    if (!this.product.name || !this.product.sku || !this.product.price) {
      this.toast.emit('Please fill required fields');
      return;
    }

    if (this.data && this.data._id) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
  }

  createProduct() {
    this.api.addProduct(this.product).subscribe(
      (res: any) => {
        if (res.success) {
          this.toast.emit('Product added successfully');
          this.close.emit();
        }
      },
      (error) => {
        console.error('CREATE ERROR:', error);
        this.toast.emit('Failed to add product');
      }
    );
  }

  updateProduct() {
    this.api.updateProduct(this.product._id, this.product).subscribe(
      (res: any) => {
        if (res.success) {
          this.toast.emit('Product updated successfully');
          this.close.emit();
        }
      },
      (error) => {
        console.error('UPDATE ERROR:', error);
        this.toast.emit('Failed to update product');
      }
    );
  }
}
