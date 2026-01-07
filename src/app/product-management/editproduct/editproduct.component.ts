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
  @Output() close = new EventEmitter<void>();
  @Input() data: any = null;

  constructor(private api: ApiService) {}
  product: any = {};
  closeEdit() {
    this.close.emit();
  }

  ngOnChanges() {
    if (this.data) {
      this.product = { ...this.data }; // clone dataa
    }
  }
  saveProduct() {
    console.log('saveProduct', this.saveProduct);
    if (!this.product.name || !this.product.sku || !this.product.price) {
      alert('Please fill required fields');
      return;
    }
    //if editng
    if (this.data && this.data._id) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
   

    console.log(this.saveProduct);
  }
  createProduct() {
    this.api.addProduct(this.product).subscribe((res: any) => {
      if (res.success) {
        alert('product added successfuly');
        this.close.emit();
      }
    });
  }
updateProduct() {
  console.log("UPDATE ID:", this.product._id);

  this.api.updateProduct(this.product._id, this.product).subscribe(
    (res: any) => {
      if (res.success) {
        alert("Product updated successfully");
        this.close.emit();   // ✅ close AFTER success
      }
    },
    (error) => {
      console.error("UPDATE ERROR:", error);
    }
  );
}


}
