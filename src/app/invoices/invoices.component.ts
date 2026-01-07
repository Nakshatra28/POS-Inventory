  import { CommonModule } from '@angular/common';
  import {
    Component,
    ElementRef,
    EventEmitter,
    OnInit,
    Output,
  } from '@angular/core';
  import { InvoicepopupComponent } from './invoicepopup/invoicepopup.component';

  import { HttpClientModule } from '@angular/common/http';
  import { ApiService } from '../service/api.service';
  import { EditinvoiceComponent } from './editinvoice/editinvoice.component';
  import { FormsModule } from '@angular/forms';
  import { Subject } from 'rxjs';

  import { PaymentpopupComponent } from '../payments/paymentpopup/paymentpopup.component';

  @Component({
    selector: 'app-invoices',
    standalone: true,
    imports: [
      CommonModule,
      InvoicepopupComponent,
      HttpClientModule,
      EditinvoiceComponent,
      FormsModule,
      PaymentpopupComponent
    ],
    templateUrl: './invoices.component.html',
    styleUrl: './invoices.component.css',
  })
  export class InvoicesComponent {
    toastMessage = '';
    openInvoicePopup = false;
    selectedInvoiceData: any = null;
    showFilter = false;
    selectedStatus = '';
    invoiceList: any[] = [];
    selectedInvoice: string[] = [];
    selectAll = false;
    openeditInvoicePopup = false;
    dataToEdit: any = null;
    allInvoices: any[] = [];
    constructor(private api: ApiService, private elementRef: ElementRef) {}

    searchText: string = '';
  

    ngOnInit() {
      this.fetchInvoices();
    }

    openPopup() {
      this.selectedInvoiceData = null; // create mode
      this.openInvoicePopup = true;
    }

    closePopup() {
      this.openInvoicePopup = false;
    }

    editInvoice(invoice: any) {
      this.dataToEdit = invoice;
      this.openeditInvoicePopup = true;
    }

    applyStatusFilter(status: string) {
      this.selectedStatus = status;
      this.showFilter = false;

      if (!status) {
        this.invoiceList = this.allInvoices;
        return;
      }

      const normalizedStatus =
        status === 'Paid'
          ? 'paid'
          : status === 'Pending'
          ? 'unpaid'
          : status.toLowerCase();

      this.invoiceList = this.allInvoices.filter(
        (inv) => inv.paymentStatus === normalizedStatus
      );
    }

    deleteInvoice(id?: string) {
      const idsToDelete = id ? [id] : this.selectedInvoice;

      if (idsToDelete.length === 0) {
        this.openToast('No invoice selected');
        return;
      }

      this.api.deleteInvoice(idsToDelete).subscribe({
        next: () => {
          this.fetchInvoices();
          this.selectedInvoice = [];
          this.selectAll = false;

          // 🔥 TOAST HERE
          this.openToast('Invoice deleted successfully');
        },
        error: () => {
          this.openToast('Failed to delete invoice');
        },
      });
    }

    toggleSelectAll(event: any) {
      this.selectAll = event.target.checked;

      if (this.selectAll) {
        this.selectedInvoice = this.invoiceList.map((p) => p._id);
      } else {
        this.selectedInvoice = [];
      }
    }

    toggleInvoice(id: string, event: any) {
      if (event.target.checked) {
        this.selectedInvoice.push(id);
      } else {
        this.selectedInvoice = this.selectedInvoice.filter((pid) => pid !== id);
        this.selectAll = false;
      }

      // auto-check header checkbox if all rows selected
      if (this.selectedInvoice.length === this.invoiceList.length) {
        this.selectAll = true;
      }
    }
    isLoading = false;
    fetchInvoices() {
      this.isLoading = true;

      this.api.getInvoices().subscribe({
        next: (res) => {
            console.log('INVOICES FROM API:', res.data);
          this.allInvoices = res.data; // 🔥 MASTER COPY
          this.invoiceList = res.data; // 🔥 DISPLAY COPY
            this.applyFilters(); // 🔥 IMPORTANT
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load invoices', err);
          this.isLoading = false;
        },
      });
    }
    getAllInvoice() {
      this.api.getInvoices().subscribe((res: any) => {
        this.invoiceList = res.data;
        this.allInvoices = res.data;
      });
    }

    closeEdit() {
      this.openeditInvoicePopup = false;
      this.getAllInvoice();
    }

    toastVisible = false;

    openToast(message: string) {
      this.toastMessage = message;
      this.toastVisible = true;

      setTimeout(() => {
        this.toastVisible = false;
      }, 3000);
    }

    toggleFilter() {
      this.showFilter = !this.showFilter;
    }

    searchInvoice() {
      this.applyFilters();
    }

    applyFilters() {
      let data = [...this.allInvoices];

      // 🔹 Status filter
      if (this.selectedStatus) {
        const normalized =
          this.selectedStatus === 'Paid'
            ? 'paid'
            : this.selectedStatus === 'Pending'
            ? 'unpaid'
            : this.selectedStatus.toLowerCase();

        data = data.filter((inv) => inv.paymentStatus === normalized);
      }

      // 🔹 Search filter
      const text = this.searchText?.trim().toLowerCase();

      if (text) {
        data = data.filter(
          (inv) =>
            inv.paymentStatus?.toLowerCase().includes(text) ||
            inv.grandTotal?.toString().includes(text) ||
            inv.customerName?.toLowerCase().includes(text)
        );
      }

      this.invoiceList = data;
    }

    showPaymentPopup = false;
invoiceForPayment: any = null;

openPaymentPopup(invoice: any) {
  this.invoiceForPayment = invoice;
  this.showPaymentPopup = true;
}

closePaymentPopup() {
  this.showPaymentPopup = false;
  this.invoiceForPayment = null;
}  

canAddPayment(invoice: any): boolean {
  return (invoice.grandTotal - (invoice.paidAmount || 0)) > 0;
}

onPaymentAdded() {
  this.showPaymentPopup = false;
  this.invoiceForPayment = null;

  // 🔥 THIS IS WHAT UPDATES REMAINING AMOUNT
  this.fetchInvoices();
}
  }
