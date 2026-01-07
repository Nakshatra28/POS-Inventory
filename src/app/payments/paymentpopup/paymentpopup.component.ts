import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-paymentpopup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './paymentpopup.component.html',
  styleUrl: './paymentpopup.component.css',
})
export class PaymentpopupComponent {
  @Output() close = new EventEmitter<void>();
  @Output() paymentAdded = new EventEmitter<void>();
  @Output() paymentError = new EventEmitter<string>();

  // 🔥 if opened from invoice later
  @Input() invoiceId: string | null = null;

  payment = {
    invoiceId: null as string | null, // ✅ ADD THIS
    paymentDate: new Date().toISOString().substring(0, 10),
    customerName: '',
    method: 'cash',
    amount: null as number | null,
    referenceNo: '',
    note: '',
  };
  constructor(private api: ApiService) {}


  ngOnInit() {
  console.log('INVOICE ID:', this.invoiceId);
}
  onClose() {
    this.close.emit();
  }

ngOnChanges() {
  if (this.invoiceId) {
    this.payment.invoiceId = this.invoiceId;
  }
}

 savePayment() {
  if (!this.invoiceId) {
    this.paymentError.emit('Invoice not found. Please reopen payment.');
    return;
  }

  if (
    !this.payment.customerName ||
    !this.payment.amount ||
    !this.payment.method
  ) {
    this.paymentError.emit('Please fill required fields');
    return;
  }

  const payload = {
    invoiceId: this.invoiceId,   // ✅ guaranteed now
    customerName: this.payment.customerName,
    amount: this.payment.amount,
    method: this.payment.method,
    referenceNo: this.payment.referenceNo,
    note: this.payment.note,
  };

  console.log('FINAL PAYMENT PAYLOAD:', payload);

this.api.createPayment(payload).subscribe({
  next: () => {
    console.log('✅ Payment saved');
    this.paymentAdded.emit();
  },
  error: (err) => {
    console.error('❌ Payment failed', err);
    this.paymentError.emit(
      err?.error?.message || 'Failed to record payment'
    );
  }
});

}

}
