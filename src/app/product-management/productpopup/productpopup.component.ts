import { Component, EventEmitter, Output, Input } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-productpopup',
  standalone: true,
  imports:[FormsModule],  
  templateUrl: './productpopup.component.html',
  styleUrls: ['./productpopup.component.css']
})
export class ProductpopupComponent {
  @Output() toast = new EventEmitter<string>();

  @Output() close = new EventEmitter<void>();
  @Input() data: any = null;
constructor(private api: ApiService) {}
  onClose() {
    this.close.emit();
  }
product = {
  sku: '',
  category: '',
  name: '',
  description: '',
  cost: null,
  price: null,
  stock: null,
  minStock: null,
  maxStock: null
};
  addproduct() {
  if (!this.product.name || !this.product.sku || !this.product.price) {
    this.toast.emit('Please fill required fields');
    return;
  }

  this.api.addProduct(this.product).subscribe(
    (res: any) => {
      if (res.success) {
        this.toast.emit('Product added successfully');
        this.close.emit();
      }
    },
    (error) => {
      console.error('ADD PRODUCT ERROR:', error);
      this.toast.emit('Failed to add product');
    }
  );
}


}
