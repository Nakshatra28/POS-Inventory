import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../service/api.service';
import { PaymentViewComponent } from './payment-view/payment-view.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule,PaymentViewComponent,FormsModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent {

  constructor(private api: ApiService) {}
 searchText: string = '';
  paymentList: any[] = [];

  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  ngOnInit() {
    this.getAllPayments();
  }

getAllPayments() {
  this.api.getPayments().subscribe({
    next: (res: any) => {
      this.allPayments = res;    // 🔥 MASTER COPY (never modify)
      this.paymentList = res;    // 🔥 DISPLAY COPY
    },
    error: () => {
      this.openToast('Failed to load payments', 'error');
    }
  });
}




  openToast(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
    setTimeout(() => this.toastVisible = false, 2500);
  }

  selectedPayment: any = null;
showViewPopup = false;

viewPayment(payment: any) {
   console.log('VIEW PAYMENT:', payment);
  this.selectedPayment = payment;
  this.showViewPopup = true;
}

allPayments: any[] = [];

  searchInvoice() {
      this.applyFilters();
    }

  applyFilters() {
  let data = [...this.allPayments]; // ✅ always start from full list

  const text = this.searchText?.trim().toLowerCase();

  if (text) {
    data = data.filter(
      (pay) =>
        pay.customerName?.toLowerCase().includes(text) ||
        pay.method?.toLowerCase().includes(text) ||
        pay.amount?.toString().includes(text) ||
        pay.status?.toLowerCase().includes(text)
    );
  }

  this.paymentList = data;
}



}
