import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { PurchespopupComponent } from './purchespopup/purchespopup.component';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { PurchesordereditComponent } from "./purchesorderedit/purchesorderedit.component";
import { ClickOutsideDirective } from '../click-outside.directive';

@Component({
  selector: 'app-purches-order',
  standalone: true,
  imports: [CommonModule, PurchespopupComponent, FormsModule, PurchesordereditComponent,ClickOutsideDirective],
  templateUrl: './purches-order.component.html',
  styleUrl: './purches-order.component.css'
})
export class PurchesOrderComponent {
  @Output() purchaseCreated = new EventEmitter<any>();

searchText: string = '';
  openPurchasePopup = false;
  selectedPurchaseData: any = null;
  purchaseOrderList: any[] = [];  
 selectedProducts:string[]=[];
  allPurchaseOrders: any[] = [];  
  constructor(private api: ApiService) {}
  openEditPurches=false;
   dataToEdit: any = null;
   showFilter=false;
ngOnInit() {
  this.fetchPurchaseOrders();
}
fetchPurchaseOrders() {
  this.api.getPurchaseOrders().subscribe({
    next: (res: any) => {
      this.allPurchaseOrders = res.data.map((po: any) => ({
        ...po,
        expectedDate: po.expectedDeliveryDate,
      }));

      this.purchaseOrderList = this.allPurchaseOrders;
    },
    error: (err) => {
      console.error('Failed to fetch purchase orders', err);
      this.openToast('Failed to load purchase orders');
    }
  });
}

  openPopup() {
    this.selectedPurchaseData = null;
    this.openPurchasePopup = true;
  }

  closePopup() {
    this.openPurchasePopup = false;
  }



   toggleFilter(event: MouseEvent) {
    event.stopPropagation(); 
    this.showFilter = !this.showFilter;
  }

  editPurchase(po: any) {
  this.dataToEdit = po;        
  this.openEditPurches = true;  
}

closeEditPurches() {
  this.openEditPurches = false;
  this.fetchPurchaseOrders();
}

  selectAll=false;


selectedPurchaseIds: string[] = [];



deletePurchase(id?: string) {
  const idsToDelete = id ? [id] : this.selectedPurchaseIds;


  if (idsToDelete.length === 0) {
    this.openToast('No purchase order selected');
    return;
  }

  const confirmDelete = confirm(
    id
      ? 'Delete this Purchase Order?'
      : `Delete ${idsToDelete.length} Purchase Orders?`
  );
  if (!confirmDelete) return;

  let completed = 0;

  idsToDelete.forEach((poId) => {

    this.api.deletePurchaseOrder(poId).subscribe({
      next: () => {
        completed++;

        // when all deletes are done
        if (completed === idsToDelete.length) {
          this.openToast('Purchase Order(s) deleted successfully');
          this.selectedPurchaseIds = [];
          this.selectAll = false;
          this.fetchPurchaseOrders(); // refresh table ONCE
        }
      },
      error: (err) => {
        console.error('❌ Delete failed for:', poId, err);
      }
    });
  });
}
 selectedStatus = '';

applyStatusFilter(status: string) {
  this.selectedStatus = status;
  this.showFilter = false;

  // RESET FILTER
  if (!status) {
    this.purchaseOrderList = this.allPurchaseOrders;
    return;
  }

  // APPLY FILTER
  this.purchaseOrderList = this.allPurchaseOrders.filter(
    po => po.status === status
  );
}









searchPurchaseOrder() {
  const text = this.searchText.trim().toLowerCase();

  if (!text) {
    this.purchaseOrderList = this.allPurchaseOrders;
    return;
  }

  this.purchaseOrderList = this.allPurchaseOrders.filter(po =>
    po.poNumber?.toLowerCase().includes(text) ||
    po.supplierName?.toLowerCase().includes(text) ||
    po.status?.toLowerCase().includes(text) ||
    po.totalAmount?.toString().includes(text)
  );
}

toastMessage = '';
toastVisible = false;

openToast(message: string) {
  this.toastMessage = message;
  this.toastVisible = true;

  setTimeout(() => {
    this.toastVisible = false;
  }, 3000);
}


handleSuccess(message: string) {
  this.openToast(message);
  this.closePopup();
   this.fetchPurchaseOrders(); 
}

handleError(message: string) {
  this.openToast(message);
}


toggleSelectAll(event: any) {
  this.selectAll = event.target.checked;

  if (this.selectAll) {
    this.selectedPurchaseIds = this.purchaseOrderList.map(po => po._id);
  } else {
    this.selectedPurchaseIds = [];
  }
}

togglePurchase(id: string, event: any) {
  if (event.target.checked) {
    this.selectedPurchaseIds.push(id);
  } else {
    this.selectedPurchaseIds = this.selectedPurchaseIds.filter(
      pid => pid !== id
    );
    this.selectAll = false;
  }


  if (this.selectedPurchaseIds.length === this.purchaseOrderList.length) {
    this.selectAll = true;
  }
}


onPurchaseUpdated() {
  this.openToast('Purchase order updated successfully');
  this.closeEditPurches();
  this.fetchPurchaseOrders();
}


onPurchaseUpdateError(message: string) {
  this.openToast(message || 'Failed to update purchase order');
}


onPurchaseSaveError(message: string) {
  this.openToast(message);
}


receivePurchase(id: string) {
  if (!confirm('Mark this purchase as received?')) return;

  this.api.receivePurchaseOrder(id).subscribe({
    next: () => {
      this.openToast('Purchase received & stock updated');
      this.fetchPurchaseOrders(); 
    },
    error: (err) => {
      console.error(err);
      this.openToast('Failed to receive purchase');
    }
  });
}


}
