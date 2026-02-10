import { Component } from '@angular/core';
import { ApiService } from '../service/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StockAdjustmentPopupComponent } from './stock-adjustment-popup/stock-adjustment-popup.component';

@Component({
  selector: 'app-stock-management',
  standalone: true,
  imports: [FormsModule, CommonModule, StockAdjustmentPopupComponent],
  templateUrl: './stock-management.component.html',
  styleUrl: './stock-management.component.css'
})
export class StockManagementComponent {

  stockMovements: any[] = [];
  filteredMovements: any[] = [];

  searchText = '';
  selectedType: 'ALL' | 'IN' | 'OUT' | 'ADJUST' = 'ALL';

  openAdjustmentPopup = false;

  summary = {
    stockInToday: 0,
    stockOutToday: 0,
    adjustmentsToday: 0,
    pendingStock: 0
  };

  toastMessage = '';
  toastVisible = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadStockMovements();
    this.loadSummary();
  }

  loadStockMovements() {
    this.api.getStockMovements().subscribe({
      next: (res: any[]) => {
        this.stockMovements = res;
        this.applyFilters();
      },
      error: err => console.error(err)
    });
  }

  loadSummary() {
    this.api.getStockSummary().subscribe({
      next: (res: any) => {
        this.summary = res;
      },
      error: err => console.error(err)
    });
  }

  applySearch() {
    this.applyFilters();
  }

  applyFilters() {
    let data = [...this.stockMovements];

    const text = this.searchText.toLowerCase().trim();
    if (text) {
      data = data.filter(m =>
        m.productName?.toLowerCase().includes(text) ||
        m.referenceId?.toLowerCase().includes(text) ||
        m.type?.toLowerCase().includes(text) ||
        m.user?.toLowerCase().includes(text)
      );
    }

    this.filteredMovements = data;
  }

  //  FIXED VIEW LOGIC
  viewMovement(m: any) {
    if (m.referenceType === 'invoice') {
      this.viewInvoice(m.referenceId);
    }
    else if (m.referenceType === 'purchase') {
      this.viewPurchaseOrder(m.referenceId);
    }
    else if (m.type === 'ADJUST') {
      this.viewAdjustment(m);
    }
    else {
      this.openToast('No details available');
    }
  }

  viewInvoice(refId: string) {
    this.openToast('Opening Invoice: ' + refId);
  }

  viewPurchaseOrder(refId: string) {
    this.openToast('Opening Purchase Order: ' + refId);
  }

  viewAdjustment(m: any) {
    const message =
      `Adjustment | ${m.productName} | Qty: ${m.quantity} | By: ${m.user}`;
    this.openToast(message);
  }

  onAdjustmentSuccess() {
    this.openToast('Stock adjusted successfully');
    this.loadStockMovements();
    this.loadSummary();
  }

  openToast(message: string) {
    this.toastMessage = message;
    this.toastVisible = true;
    setTimeout(() => (this.toastVisible = false), 3000);
  }
}
