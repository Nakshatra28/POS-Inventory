import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-purchesorderedit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './purchesorderedit.component.html',
  styleUrl: './purchesorderedit.component.css'
})
export class PurchesordereditComponent {

@Input() data: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() purchaseUpdated = new EventEmitter<void>();
@Output() purchaseUpdateError = new EventEmitter<string>();
@Output() purchaseSaveError = new EventEmitter<string>();


  constructor(private api: ApiService) {}

  purchase: any = {};

  // 🔥 SAME AS PRODUCT
 ngOnChanges() {
  if (this.data) {
    this.purchase = {
      _id: this.data._id,

      supplierName: this.data.supplierName,
      purchaseNo: this.data.poNumber,

      orderDate: this.data.orderDate?.slice(0, 10),
      expectedDate: this.data.expectedDeliveryDate?.slice(0, 10),

      productName: this.data.items?.[0]?.productName || '',
      quantity: this.data.items?.[0]?.quantity || 1,
      cost: this.data.items?.[0]?.price || 0,

      total: this.data.totalAmount || 0,
      status: this.data.status || 'pending'
    };
  }
}


  savePurchase() {
    if (!this.purchase.supplierName || !this.purchase.purchaseNo) {
    this.purchaseSaveError.emit('Please fill required fields');
      return;
    }

    if (this.data && this.data._id) {
      this.updatePurchase();
    }
  }

updatePurchase() {
  const payload = {
    poNumber: this.purchase.purchaseNo,
    supplierName: this.purchase.supplierName,
    orderDate: this.purchase.orderDate,
    expectedDeliveryDate: this.purchase.expectedDate,
    items: [{
      productName: this.purchase.productName,
      quantity: this.purchase.quantity,
      price: this.purchase.cost,
      total: this.purchase.total
    }],
    totalAmount: this.purchase.total,
    status: this.purchase.status
  };

  this.api.updatePurchaseOrder(this.purchase._id, payload).subscribe({
    next: () => {
      this.purchaseUpdated.emit(); // ✅ success
      this.close.emit();
    },
    error: () => {
      this.purchaseUpdateError.emit('Failed to update purchase order'); // ❌ error
    }
  });
}


  calculateTotal() {
    this.purchase.total =
      (Number(this.purchase.quantity) || 0) *
      (Number(this.purchase.cost) || 0);
  }
onClose() {
  this.close.emit();
}
}
