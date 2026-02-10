import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { ClickOutsideDirective } from '../click-outside.directive';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule,ClickOutsideDirective],
  templateUrl: './audit-logs.component.html',
  styleUrl: './audit-logs.component.css'
})
export class AuditLogsComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  allLogs: any[] = []; 
  filteredLogs: any[] = []; 
  displayedLogs: any[] = []; 
   showFilter = false;
  searchText = '';
  isLoading = false;
  fromDate = '';
  toDate = '';
  selectedModule = 'All';
  modules = ['All', 'Invoice', 'Payment', 'Purchase', 'Product', 'Customer'];
  

  currentDisplayCount = 5; 
  itemsPerLoad = 5; 
  
 
  summary = {
    totalSales: 0,
    stockValue: 0,
    outstandingPayment: 0,
    activeCustomers: 0
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadAllAuditLogs();
    this.loadSummaryCards();
  }

  ngAfterViewInit() {
    if (this.scrollContainer) {
      const container = this.scrollContainer.nativeElement;
      container.addEventListener('scroll', () => {
        this.checkScroll();
      });
     
    }
  }

  checkScroll() {
    const container = this.scrollContainer.nativeElement;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

  


    if (scrollTop + clientHeight >= scrollHeight - 50) {
      this.loadMoreItems();
    }
  }

 
  loadAllAuditLogs() {
    this.isLoading = true;

    this.api.getAuditLogsFiltered({}).subscribe({
      next: (res: any) => {
        
        this.allLogs = res.data || [];
        this.applyFiltersAndSearch();
        this.isLoading = false;
      },
      error: (err) => {
console.error('Error loading audit logs:', err);
        this.isLoading = false;
      }
    });
  }

 applyFiltersAndSearch() {
  let filtered = [...this.allLogs];

  if (this.fromDate) {
    const from = new Date(this.fromDate);
    filtered = filtered.filter(log => new Date(log.createdAt) >= from);
  }

  if (this.toDate) {
    const to = new Date(this.toDate);
    filtered = filtered.filter(log => new Date(log.createdAt) <= to);
  }

  if (this.selectedModule !== 'All') {
    filtered = filtered.filter(log => {
      const moduleValue =
        log.module ||
        log.entity ||
        log.action ||
        log.type ||
        log.reference ||
        '';

      return moduleValue
        .toString()
        .toLowerCase()
        .includes(this.selectedModule.toLowerCase());
    });
  }

  if (this.searchText) {
    const search = this.searchText.toLowerCase();

    filtered = filtered.filter(log =>
      log.user?.toLowerCase().includes(search) ||
      log.details?.toLowerCase().includes(search) ||
      log.status?.toLowerCase().includes(search) ||
      log.ipAddress?.toLowerCase().includes(search) ||
      log.module?.toLowerCase().includes(search) ||
      log.entity?.toLowerCase().includes(search) ||
      log.action?.toLowerCase().includes(search)
    );
  }

  this.filteredLogs = filtered;
  this.currentDisplayCount = this.itemsPerLoad;
  this.updateDisplayedLogs();
}


  loadMoreItems() {
    if (this.currentDisplayCount >= this.filteredLogs.length) {
      return;
    }

    this.currentDisplayCount += this.itemsPerLoad;
    this.updateDisplayedLogs();
  }

  updateDisplayedLogs() {
    this.displayedLogs = this.filteredLogs.slice(0, this.currentDisplayCount);
  }

  searchLogs() {
    this.applyFiltersAndSearch();
    this.scrollToTop();
  }

  resetFilter() {
    this.fromDate = '';
    this.toDate = '';
    this.selectedModule = 'All';
    this.searchText = '';
    this.applyFiltersAndSearch();
    this.scrollToTop();
  }

  scrollToTop() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = 0;
    }
  }

  exportLogs() {
    const params: any = {};
    if (this.fromDate) params.from = this.fromDate;
    if (this.toDate) params.to = this.toDate;
    if (this.selectedModule !== 'All') params.module = this.selectedModule;

    this.api.exportAuditLogs(params).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'audit-logs.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  loadSummaryCards() {
    this.api.getAuditSummaryCards().subscribe({
      next: (res) => {
        this.summary = res;
      },
      error: (err) => console.error(err)
    });
  }

  get hasMoreItems(): boolean {
    return this.currentDisplayCount < this.filteredLogs.length;
  }


filterOptions: string[] = [
  'All',
  'Invoice',
  'Payment',
  'Purchase',
  'Product',
  'Customer'
];

selectedFilter: string = 'All';



toggleFilter() {
  this.showFilter = !this.showFilter;
}
selectFilter(option: string) {
  this.selectedModule = option;  
  this.showFilter = false;

  this.applyFiltersAndSearch();   
  this.scrollToTop();
}



  
}