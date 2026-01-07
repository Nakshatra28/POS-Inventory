import { Component } from '@angular/core';
import { SupplierpopupComponent } from './supplierpopup/supplierpopup.component';
import { CommonModule } from '@angular/common';
import { ApiService } from '../service/api.service';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { SuppliereditComponent } from "./supplieredit/supplieredit.component";
import { ClickOutsideDirective } from '../click-outside.directive';

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [SupplierpopupComponent, CommonModule, FormsModule, SuppliereditComponent,ClickOutsideDirective],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.css',
})
export class SupplierComponent {
  supplierToEdit =null;
  filteredSuppliers: any[] = [];
  constructor(private api: ApiService) {}
  openSupplierPopup = false;
  openSupplierEdit=false;
  showFilter = false;
  searchSubject = new Subject<string>();
  searchText: string = '';

  selectAll = false;

  ngOnInit() {
    this.getAllSupplier();
  }

  openPopup() {
    this.openSupplierPopup = true;
  }

  closePopup() {
    this.openSupplierPopup = false;
  }

  closeEdit()
{
  this.openSupplierEdit=false;
}

  toggleFilter(event: MouseEvent) {
    event.stopImmediatePropagation();
    this.showFilter = !this.showFilter;
  }
  allSupplier: any[] = [];
  selectedStatus = '';
  applyStatusFilter(status: string) {
    this.selectedStatus = status;
    this.showFilter = false;

    if (!status) {
      this.filteredSuppliers = this.allSupplier;
      return;
    }
    this.filteredSuppliers = this.allSupplier.filter(
      (supplier) => supplier.status === status
    );
  }

  getAllSupplier() {
    this.api.getAllSupplier().subscribe((res) => {
      console.log('SUPPLIERS FROM API:', res); // 🔍
      this.allSupplier = res;
      this.filteredSuppliers = res;
    });
  }
  selectedSupplier: any[] = [];

toggleSelectAll(event: any) {
  this.selectAll = event.target.checked;

  if (this.selectAll) {
    this.selectedSupplier = this.filteredSuppliers.map(
      (supplier) => supplier._id
    );
  } else {
    this.selectedSupplier = [];
  }
}


toggleSupplier(id: string, event: any) {
  if (event.target.checked) {
    if (!this.selectedSupplier.includes(id)) {
      this.selectedSupplier.push(id);
    }
  } else {
    this.selectedSupplier = this.selectedSupplier.filter(
      (pid) => pid !== id
    );
  }

  // 🔥 sync with visible rows only
  this.selectAll =
    this.selectedSupplier.length === this.filteredSuppliers.length;
}
  searchCustomers() {
    const value = this.searchText.trim().toLowerCase();

    if (!value) {
      this.filteredSuppliers = this.allSupplier;
      return;
    }

    this.filteredSuppliers = this.allSupplier.filter(
      (supplier) =>
        supplier.name?.toLowerCase().includes(value) ||
        supplier.email?.toLowerCase().includes(value) ||
        supplier.phone?.includes(value)
    );
  }

  openEdit(supplier:any){
    console.log('PARENT → supplier clicked:', supplier);
      this.supplierToEdit = supplier;    // 🔥 ADD THIS
    this.openSupplierEdit=true;
  }


show = false;
message = '';
type: 'success' | 'error' = 'success';

open(message: string, type: 'success' | 'error' = 'success') {
  this.message = message;
  this.type = type;
  this.show = true;

  setTimeout(() => {
    this.show = false;
  }, 2500);
}

  
deleteSupplier(id?: string) {
  const idsToDelete = id ? [id] : this.selectedSupplier;

  console.log('Deleting IDs:', idsToDelete); // 🔍

  if (idsToDelete.length === 0) {
    this.open('No supplier selected', 'error');
    return;
  }

  this.api.deleteSupplier(idsToDelete).subscribe(
    (res) => {
      console.log('DELETE RESPONSE:', res); // 🔍
      this.open('Supplier deleted successfully', 'success');
      this.selectedSupplier = [];
      this.selectAll = false;
      this.getAllSupplier();
    },
    (err) => {
       this.showToast('Failed to delete supplier',err);
     
    }
  );
}



// 🔔 Toast state
toastVisible = false;
toastMessage = '';
toastType: 'success' | 'error' = 'success';

showToast(message: string, type: 'success' | 'error' = 'success') {
  this.toastMessage = message;
  this.toastType = type;
  this.toastVisible = true;

  setTimeout(() => {
    this.toastVisible = false;
  }, 2500);
}


onSupplierUpdated() {
  this.showToast('Supplier updated successfully', 'success');
  this.getAllSupplier();
}

onSupplierUpdateError(message: string) {
  this.showToast(message, 'error');
}

}
