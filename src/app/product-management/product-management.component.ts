import { CommonModule } from '@angular/common';

import { Component, OnInit } from '@angular/core';
import { ProductpopupComponent } from './productpopup/productpopup.component';
import { ApiService } from '../service/api.service';
import { EditproductComponent } from './editproduct/editproduct.component';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { HostListener, ElementRef, ViewChild } from '@angular/core';
import { ClickOutsideDirective } from '../click-outside.directive';
@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    CommonModule,
    ProductpopupComponent,
    EditproductComponent,
    FormsModule,
    ClickOutsideDirective,
  ],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css',
})
export class ProductManagementComponent implements OnInit {
  selectAll = false;
  productList: any[] = [];
  constructor(private api: ApiService, private elementRef: ElementRef) {}
  openProductPopup = false;
  openEditProduct = false;
  dataToEdit: any = null;
  selectedProducts: string[] = [];
  searchSubject = new Subject<string>();
  showFilter = false;
  selectedStatus = '';
  @ViewChild('filterBox') filterBox!: ElementRef;

  ngOnInit() {
    this.getAllProduct();

    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.searchProduct();
    });
  }
  openEdit(prod: any) {
    console.log('xyz', this.productList);
    this.openEditProduct = true;
    this.dataToEdit = prod;
   
  }
  closeEdit() {
    this.openEditProduct = false;
    this.getAllProduct();
  }
  openPopup() {
    this.openProductPopup = true;
  }

  closePopup() {
    this.openProductPopup = false;
    this.getAllProduct();
  }

  getAllProduct() {
    this.api.getProducts().subscribe((res: any) => {
      this.productList = res.data; // ⭐ very important
      this.allProducts = res.data; // 👈 important backup
      console.log('getproduct', res);
    });
  }

  toggleSelectAll(event: any) {
    this.selectAll = event.target.checked;

    if (this.selectAll) {
      this.selectedProducts = this.productList.map((p) => p._id);
    } else {
      this.selectedProducts = [];
    }
  }
  onSelectProduct(product: any, event: any) {}

  toggleProduct(id: string, event: any) {
    if (event.target.checked) {
      this.selectedProducts.push(id);
    } else {
      this.selectedProducts = this.selectedProducts.filter((pid) => pid !== id);
      this.selectAll = false;
    }

    // auto-check header checkbox if all rows selected
    if (this.selectedProducts.length === this.productList.length) {
      this.selectAll = true;
    }
  }

  deleteProduct(id?: string) {
    const idsToDelete = id ? [id] : this.selectedProducts;

    console.log('IDs to delete:', idsToDelete);

    if (idsToDelete.length === 0) {
       this.openToast('No product selected');
      return;
    }

    this.api.deleteProducts(idsToDelete).subscribe(
      (res: any) => {
       this.handleSuccess('Product deleted successfully');
        this.selectedProducts = [];
        this.selectAll = false;
        this.getAllProduct();
      },
      (error) => {
         this.handleError('Failed to delete product');
      }
    );
    this.getAllProduct();
  }
  searchText: string = '';
  allProducts: any[] = [];

  searchProduct() {
    const text = this.searchText.trim().toLocaleLowerCase();

    if (!text) {
      this.productList = this.allProducts;
      return;
    }

    this.productList = this.allProducts.filter(
      (product) =>
        product.name?.toLocaleLowerCase().includes(text) ||
        product.category?.toLowerCase().includes(text) ||
        product.status?.toLowerCase().includes(text)
    );
  }
  toggleFilter(event: MouseEvent) {
    event.stopPropagation(); // 👈 VERY IMPORTANT
    this.showFilter = !this.showFilter;
  }

  applyStatusFilter(status: string) {
    this.selectedStatus = status;
    this.showFilter = false;

    if (!status) {
      this.productList = this.allProducts;
      return;
    }

    this.productList = this.allProducts.filter(
      (product) => product.status === status
    );
  }

  // @HostListener('document:click', ['$event'])
  // onClickOutside(event: MouseEvent) {
  //   if (!this.showFilter) return;

  //  const clickedInside = this.filterBox.nativeElement.contains(event.target);

  //   if (!clickedInside) {
  //     this.showFilter = false;
  //   }

  // }
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
    this.getAllProduct(); // refresh list
  } 

  handleError(message: string) {
    this.openToast(message); // same toast, different text
  }
}
