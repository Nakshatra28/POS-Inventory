import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-stock-adjustment-popup',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './stock-adjustment-popup.component.html',
  styleUrl: './stock-adjustment-popup.component.css'
})
export class StockAdjustmentPopupComponent {
  
  @Output() close = new EventEmitter<void>();
@Output() success = new EventEmitter<void>();



  products: any[] = [];
  selectedProduct: any = null;

  quantity = 0;
  reason = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getProducts().subscribe({
      next: (res: any) => this.products = res.data || res
    });
  }

  saveAdjustment() {
    if (!this.selectedProduct || !this.quantity) {
      alert('Select product and quantity');
      return;
    }

    const payload = {
      productId: this.selectedProduct._id,
      quantity: this.quantity,
      reason: this.reason,
      user: 'admin'
    };

    this.api.adjustStock(payload).subscribe({
      next: () => {
        this.success .emit();
        this.close.emit();
      },
      error: err => console.error(err)
    });
  }

}
