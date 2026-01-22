import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-purchespopup',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './purchespopup.component.html',
  styleUrl: './purchespopup.component.css'
})
export class PurchespopupComponent {
  @Output() purchaseCreated = new EventEmitter<string>();
@Output() purchaseFailed = new EventEmitter<string>();

    @Output() close = new EventEmitter<void>();
  @Input() data: any = null;   // For edit mode if needed
    constructor(private api: ApiService) {}
products: any[] = [];
selectedProduct: any = null;



loadProducts() {
  this.api.getProducts().subscribe({
    next: (res: any) => {
      this.products = res.data || [];  
    },
    error: err => console.error(err)
  });
}

  onClose() {
    this.close.emit();
  }

purchase = {
  supplierName: '',
  purchaseNo: '',
  orderDate: '',
  expectedDate: '',
  quantity: 1,
  cost: 0,
  total: 0,
  status: 'pending',
  notes: ''
};


ngOnInit() {
    this.loadProducts();
  if (this.data) {
    this.purchase = { ...this.data };
  }
}

savePurchase() {

  if (
    !this.purchase.supplierName ||
    !this.purchase.purchaseNo ||
    !this.purchase.orderDate ||
    !this.purchase.expectedDate
  ) {
    this.purchaseFailed.emit('Please fill all required fields');
    return;
  }

  if (!this.selectedProduct) {
    this.purchaseFailed.emit('Please select a product');
    return;
  }

  const orderDate = new Date(this.purchase.orderDate);
  const expectedDate = new Date(this.purchase.expectedDate);

  if (isNaN(orderDate.getTime()) || isNaN(expectedDate.getTime())) {
    this.purchaseFailed.emit('Invalid date selected');
    return;
  }

  const payload = {
    poNumber: this.purchase.purchaseNo,
    supplierName: this.purchase.supplierName,
    orderDate,
    expectedDeliveryDate: expectedDate,
    items: [
      {
        productId: this.selectedProduct._id,
        productName: this.selectedProduct.name,
        quantity: this.purchase.quantity,
        price: this.purchase.cost,
        total: this.purchase.total
      }
    ],
    totalAmount: this.purchase.total,
    status: this.purchase.status
  };


  
  this.api.createPurchaseOrder(payload).subscribe({
    next: (res: any) => {
      this.purchaseCreated.emit('Purchase Order created successfully');
      this.onClose();
    },
    error: (err: any) => {
      console.error('❌ BACKEND ERROR:', err);
      this.purchaseFailed.emit('Failed to create Purchase Order');
    }
  });
}


calculateTotal() {
  const qty = Number(this.purchase.quantity) || 0;
  const cost = Number(this.purchase.cost) || 0;

  this.purchase.total = qty * cost;
}



}
