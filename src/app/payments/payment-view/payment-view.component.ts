import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-payment-view',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './payment-view.component.html',
  styleUrl: './payment-view.component.css'
})
export class PaymentViewComponent {
  @Input() payment: any;      // payment data to display
  @Output() close = new EventEmitter<void>();

}
