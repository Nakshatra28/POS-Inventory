import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-editinvoice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editinvoice.component.html',
  styleUrl: './editinvoice.component.css',
})
export class EditinvoiceComponent implements OnInit, OnChanges {
  @Input() data: any = null;
  @Output() close = new EventEmitter<void>();
@Output() toast = new EventEmitter<string>();
 
  constructor(private api: ApiService) {}

  invoice = {
      _id: '', 
    invoiceNo: '', // ✅ ADD THIS
    customerId: '',
    customerName: '',
    customerPhone: '',
    items: [] as any[],
    paymentMethod: 'cash',
    paymentStatus: 'unpaid',
    tax: 0,
    discount: 0,
    invoiceDate: '',
    dueDate: '',
    notes: '',
  };

  product = {
    productId: '',
    quantity: 1,
    price: 0,
  };
  products: any[] = [];
  customers: any[] = [];

  ngOnInit() {
    this.loadCustomers();
    this.loadProducts();
  }

  loadCustomers() {
    this.api.getCustomers().subscribe({
      next: (res: any) => {
        this.customers = res.data || res;
      },
      error: (err) => console.error(err),
    });
  }

  loadProducts() {
    this.api.getProducts().subscribe({
      next: (res: any) => {
        this.products = res.data;
      },
      error: (err) => console.error(err),
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      this.invoice = {
        ...this.data,
        invoiceDate: this.data.invoiceDate
          ? this.data.invoiceDate.substring(0, 10)
          : '',
        dueDate: this.data.dueDate ? this.data.dueDate.substring(0, 10) : '',
        items: [...(this.data.items || [])],
      };
    }
  }

  closeEdit() {
    this.close.emit();
  }

  saveInvoice() {

  if (!this.invoice.customerId || this.invoice.items.length === 0) {
    this.toast.emit('Customer and at least one product are required');
    return;
  }

  // calculate totals
  const subTotal = this.invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const payload = {
    ...this.invoice,
    subTotal,
    grandTotal: subTotal + this.invoice.tax - this.invoice.discount
  };


 
  this.api.updateInvoice(this.invoice._id, payload).subscribe(
    () => {
   this.toast.emit('Invoice updated successfully');
      this.close.emit(); 
    },
    (error) => {
      console.error('Update failed', error);
      this.toast.emit('Failed to update invoice');
    }
  );
}

  addProduct() {
    if (!this.product.quantity || !this.product.price) {
      this.toast.emit('Enter quantity and price');
      return;
    }

    this.invoice.items.push({ ...this.product });

    // reset product input
    this.product = {
      productId: '',
      quantity: 1,
      price: 0,
    };
  }

  onCustomerChange() {
    const selected = this.customers.find(
      (c) => c._id === this.invoice.customerId
    );

    if (selected) {
      this.invoice.customerName = selected.name;
      this.invoice.customerPhone = selected.phone;
    }
  }
  onClose() {
    this.close.emit();
  }

  getProductName(productId: string) {
    const p = this.products.find((prod) => prod._id === productId);
    return p ? p.name : 'Unknown';
  }

  removeItem(index: number) {
    this.invoice.items.splice(index, 1);
  }
}
