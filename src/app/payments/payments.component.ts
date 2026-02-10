import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { PaymentViewComponent } from './payment-view/payment-view.component';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule, PaymentViewComponent],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {

  constructor(private api: ApiService) {}

  // ===== SEARCH =====
  searchText: string = '';

  // ===== DATA SOURCES =====
  originalPayments: any[] = [];  
  allPayments: any[] = [];       
  visiblePayments: any[] = [];    // UI list (scroll)
  // ===== SCROLL CONFIG =====
  itemsToShow = 5;
  currentIndex = 0;

  // ===== VIEW POPUP =====
  selectedPayment: any = null;
  showViewPopup = false;

  // ===== TOAST =====
  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  ngOnInit(): void {
    this.getAllPayments();
  }

  // ===== API =====
  getAllPayments(): void {
    this.api.getPayments().subscribe({
      next: (res: any[]) => {
        this.originalPayments = res;
        this.allPayments = res;

        this.resetScroll();
      },
      error: () => {
        this.openToast('Failed to load payments', 'error');
      }
    });
  }

  // ===== SCROLL LOGIC =====
  resetScroll(): void {
    this.visiblePayments = [];
    this.currentIndex = 0;
    this.loadMore();
  }

  loadMore(): void {
    if (this.currentIndex >= this.allPayments.length) return;

    const next = this.allPayments.slice(
      this.currentIndex,
      this.currentIndex + this.itemsToShow
    );

    this.visiblePayments.push(...next);
    this.currentIndex += this.itemsToShow;
  }

  onScroll(event: any): void {
    const el = event.target;

    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      this.loadMore();
    }
  }

  // ===== SEARCH =====
  searchInvoice(): void {
    const text = this.searchText.trim().toLowerCase();

    let data = [...this.originalPayments];

    if (text) {
      data = data.filter(pay =>
        pay.customerName?.toLowerCase().includes(text) ||
        pay.method?.toLowerCase().includes(text) ||
        pay.amount?.toString().includes(text) ||
        pay.status?.toLowerCase().includes(text)
      );
    }

    this.allPayments = data;
    this.resetScroll();
  }

  // ===== VIEW =====
  viewPayment(payment: any): void {
    this.selectedPayment = payment;
    this.showViewPopup = true;
  }

  // ===== TOAST =====
  openToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 2500);
  }
}
