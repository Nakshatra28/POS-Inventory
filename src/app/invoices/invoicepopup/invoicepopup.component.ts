import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-invoicepopup',
  standalone: true,
  imports:[CommonModule,FormsModule],
  templateUrl: './invoicepopup.component.html',
  styleUrls: ['./invoicepopup.component.css']
})
export class InvoicepopupComponent  implements OnInit {
  
  @Output() close = new EventEmitter<void>();
  @Output() invoiceCreated = new EventEmitter<void>();
  @Input() data: any = null;
  @Output() showToast = new EventEmitter<string>();
invoice = {
  customerId: '',
  customerName: '',
  customerPhone: '',
  items: [] as any[],
  paymentMethod: 'cash',
  paymentStatus: 'unpaid',
  tax: 0,
  discount: 0,
  invoiceDate: new Date().toISOString().substring(0, 10), // ✅ today
  dueDate: ''                                             // ✅ optional
};




product = {
  productId: '',
  quantity: 1,
  price: 0
};
products: any[] = [];
customers: any[] = [];

ngOnInit() {
 this.loadProducts();
   this.loadCustomers();
}
loadCustomers() {
  this.api.getCustomers().subscribe({
    next: (res: any) => {
      this.customers = res.data || res; // ✅ IMPORTANT
      console.log('Customers loaded:', this.customers);
    },
    error: (err) => {
      console.error('Failed to load customers', err);
    }
  });
}


  onClose() {
    this.close.emit();
  }
  addProduct() {
    console.log("invoice",this.invoice)
  if (!this.product.quantity || !this.product.price) {
    alert('Enter quantity & price');
    return;
  }

  this.invoice.items.push({ ...this.product });

  // reset product input
  this.product = {
    productId: '',
    quantity: 1,
    price: 0
  };
}


 
constructor(private api: ApiService, private elementRef: ElementRef) {}

  calculateSubTotal() {
    return this.invoice.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
  }

 createInvoice() {

  if (!this.invoice.customerName || this.invoice.items.length === 0) {
    this.showToast.emit('Customer name and at least one product are required');
    return;
  }

  const subTotal = this.calculateSubTotal();
  const payload = {
    ...this.invoice,
    subTotal,
    grandTotal: subTotal + this.invoice.tax - this.invoice.discount
  };

  console.log('FINAL PAYLOAD:', payload);

  this.api.createInvoice(payload).subscribe({
    next: () => {
      this.invoiceCreated.emit();                  // 🔥 refresh parent list
      this.showToast.emit('Invoice created successfully'); // 🔥 toast
      this.onClose();                              // 🔥 close popup
    },
    error: (err) => {
      console.error(err);
      this.showToast.emit('Failed to create invoice'); // 🔥 toast (no alert)
    }
  });
}


loadProducts() {
  this.api.getProducts().subscribe({
    next: (res: any) => {
      this.products = res.data; // ✅ correct
      console.log('Products loaded:', this.products);
    },
    error: (err) => {
      console.error('Failed to load products', err);
    }
  });

  

}

onCustomerChange() {
  const selected = this.customers.find(
    c => c._id === this.invoice.customerId
  );

  if (selected) {
    this.invoice.customerName = selected.name;
    this.invoice.customerPhone = selected.phone;
  }
}

getProductName(productId: string) {
  const p = this.products.find(prod => prod._id === productId);
  return p ? p.name : 'Unknown';
}

removeItem(index: number) {
  this.invoice.items.splice(index, 1);
}



}