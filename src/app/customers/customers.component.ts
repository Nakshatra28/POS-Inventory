import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CustomerpopupComponent } from './customerpopup/customerpopup.component';
import { EditcustomerComponent } from './editcustomer/editcustomer.component';
import { ApiService } from '../service/api.service';
import { ClickOutsideDirective } from '../click-outside.directive';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    CustomerpopupComponent,
    EditcustomerComponent,
    ClickOutsideDirective,
  ],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
})
export class CustomersComponent implements OnInit {
  selectedCustomers: string[] = [];
  customerList: any[] = [];
  searchSubject = new Subject<string>();
  isLoading = false;
  error: string | null = null;
  showFilter = false;
  openCustomerPopup = false;
  openEditcustomer = false;
  dataToEdit: any = null;
  selectAll = false;
  searchText: string = '';
  constructor(private api: ApiService) {}
  filteredCustomers: any[] = [];

  ngOnInit() {
    this.getAllCustomers();
  }

  filterCustomers(text: string) {
    if (!text) {
      this.filteredCustomers = this.customerList;
      return;
    }

    this.filteredCustomers = this.customerList.filter(
      (customer) =>
        customer.name.toLowerCase().includes(text.toLowerCase()) ||
        customer.email.toLowerCase().includes(text.toLowerCase()) ||
        customer.phone.includes(text)
    );
  }
  openPopup() {
    this.openCustomerPopup = true;
  }

  showToast = false;
  toastMessage = '';
  closePopup() {
    this.openCustomerPopup = false;
    this.getAllCustomers();

    this.toastMessage = 'Customer added successfully';
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000); // auto hide after 3 sec
  }

  onEdit(customer: any) {
    this.openEditcustomer = true;
    this.dataToEdit = customer;
  }

  closeEdit() {
    this.openEditcustomer = false;
    this.getAllCustomers();
  }

  getAllCustomers() {
    this.isLoading = true;
    this.error = null;

    this.api.getCustomers().subscribe({
      next: (res: any) => {

        this.allCustomer = res; // 🔥 REQUIRED
        this.filteredCustomers = res; // 🔥 REQUIRED

        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to load customers', err);
        this.error = 'Failed to load customers. Try again later.';
        this.isLoading = false;
      },
    });
  }

  trackById(_: number, item: any) {
    return item?._id; // ✅ FIXED
  }
  toggleFilter(event: MouseEvent) {
    event.stopPropagation(); // 🔥 THIS IS REQUIRED
    this.showFilter = !this.showFilter;
  }

  toggleCustomer(id: string, event: any) {
    if (event.target.checked) {
      this.selectedCustomers.push(id);
    } else {
      this.selectedCustomers = this.selectedCustomers.filter(
        (pid) => pid !== id
      );
      this.selectAll = false;
    }

    // auto-check header checkbox if all rows selected
    if (this.selectedCustomers.length === this.customerList.length) {
      this.selectAll = true;
    }
  }
 toggleSelectAll(event: any) {
  this.selectAll = event.target.checked;

  if (this.selectAll) {
    this.selectedCustomers = this.filteredCustomers.map(
      (c) => c._id
    );
  } else {
    this.selectedCustomers = [];
  }
}


  deleteCustomer(id?: string) {
    
    const idsToDelete = id ? [id] : this.selectedCustomers;


    if (idsToDelete.length === 0) {
 this.showToastMessage('No customer selected');
       return;
    }

    this.api.deleteCustomer(idsToDelete).subscribe(
      (res: any) => {
       this.showToastMessage('Customer deleted successfully');
        this.selectedCustomers = [];
        this.selectAll = false;
        this.getAllCustomers();
      },
      (error) => {
        console.error('DELETE ERROR:', error);
      }
    );
    this.getAllCustomers();
  }
  allCustomer: any[] = [];
  searchProduct() {
    const text = this.searchText.trim().toLocaleLowerCase();

    if (!text) {
      this.filteredCustomers = this.allCustomer;
      return;
    }

    this.customerList = this.allCustomer.filter(
      (customer) =>
        customer.name?.toLocaleLowerCase().includes(text) ||
        customer.email?.toLowerCase().includes(text) ||
        customer.phone?.toLowerCase().includes(text) ||
        customer.status?.toLowerCase().includes(text)
    );
  }
  selectedStatus = '';

  applyStatusFilter(status: string) {
    this.selectedStatus = status;
    this.showFilter = false;

    if (!status) {
      this.filteredCustomers = this.allCustomer;
      return;
    }

    this.filteredCustomers = this.allCustomer.filter(
      (customer) => customer.status === status
    );
  }

  clearFilters() {
    this.searchText = '';
    this.selectedStatus = '';
    this.filteredCustomers = this.allCustomer;
  }
  searchCustomers() {
    const value = this.searchText.trim().toLowerCase();

    if (!value) {
      this.filteredCustomers = this.allCustomer;
      return;
    }

    this.filteredCustomers = this.allCustomer.filter(
      (customer) =>
        customer.name?.toLowerCase().includes(value) ||
        customer.email?.toLowerCase().includes(value) ||
        customer.phone?.includes(value)
    );
  }

  showToastMessage(message: string) {
  this.toastMessage = message;
  this.showToast = true;

  setTimeout(() => {
    this.showToast = false;
  }, 3000);
}



openToast(message: string) {
  this.toastMessage = message;
  this.showToast = true;

  setTimeout(() => {
    this.showToast = false;
  }, 3000);
}
}
