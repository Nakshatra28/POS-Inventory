import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-logs.component.html',
  styleUrl: './audit-logs.component.css'
})
export class AuditLogsComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  allLogs: any[] = []; // Store ALL logs from backend
  filteredLogs: any[] = []; // Store filtered logs
  displayedLogs: any[] = []; // Logs currently shown (paginated)
  
  searchText = '';
  isLoading = false;
  fromDate = '';
  toDate = '';
  selectedModule = 'All';
  modules = ['All', 'Invoice', 'Payment', 'Purchase', 'Product', 'Customer'];
  
  // Frontend Pagination
  currentDisplayCount = 5; // Start with 5
  itemsPerLoad = 5; // Load 5 more on each scroll
  
  // Summary
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
    // Attach scroll listener after view init
    if (this.scrollContainer) {
      const container = this.scrollContainer.nativeElement;
      container.addEventListener('scroll', () => {
        this.checkScroll();
      });
      console.log('Scroll listener attached');
    }
  }

  checkScroll() {
    const container = this.scrollContainer.nativeElement;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    console.log('=== SCROLL EVENT ===');
    console.log('scrollTop:', scrollTop);
    console.log('scrollHeight:', scrollHeight);
    console.log('clientHeight:', clientHeight);
    console.log('Can scroll?', scrollHeight > clientHeight);
    console.log('==================');

    // Check if scrolled to bottom (within 50px)
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      console.log('✅ Bottom reached! Loading more...');
      this.loadMoreItems();
    }
  }

  // Load ALL data from backend once
  loadAllAuditLogs() {
    this.isLoading = true;
    console.log('Loading all audit logs from backend...');

    this.api.getAuditLogsFiltered({}).subscribe({
      next: (res: any) => {
        console.log('Received ALL logs:', res.data?.length || 0);
        
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

  // Apply filters and search on frontend
  applyFiltersAndSearch() {
    console.log('Applying filters and search...');
    
    // Start with all logs
    let filtered = [...this.allLogs];

    // Apply date filters
    if (this.fromDate) {
      filtered = filtered.filter(log => {
        const logDate = new Date(log.createdAt);
        const from = new Date(this.fromDate);
        return logDate >= from;
      });
    }

    if (this.toDate) {
      filtered = filtered.filter(log => {
        const logDate = new Date(log.createdAt);
        const to = new Date(this.toDate);
        return logDate <= to;
      });
    }

    // Apply module filter
    if (this.selectedModule !== 'All') {
      filtered = filtered.filter(log => log.module === this.selectedModule);
    }

    // Apply search filter
    if (this.searchText) {
      const search = this.searchText.toLowerCase();
      filtered = filtered.filter(log => {
        return (
          log.user?.toLowerCase().includes(search) ||
          log.module?.toLowerCase().includes(search) ||
          log.details?.toLowerCase().includes(search) ||
          log.status?.toLowerCase().includes(search) ||
          log.ipAddress?.toLowerCase().includes(search)
        );
      });
    }

    console.log('Filtered logs count:', filtered.length);
    
    this.filteredLogs = filtered;
    
    // Reset display count and show first batch
    this.currentDisplayCount = this.itemsPerLoad;
    this.updateDisplayedLogs();
  }

  // Load more items on scroll
  loadMoreItems() {
    if (this.currentDisplayCount >= this.filteredLogs.length) {
      console.log('All items already displayed');
      return;
    }

    console.log('Loading more items...');
    this.currentDisplayCount += this.itemsPerLoad;
    this.updateDisplayedLogs();
  }

  // Update displayed logs based on current count
  updateDisplayedLogs() {
    this.displayedLogs = this.filteredLogs.slice(0, this.currentDisplayCount);
    console.log('Displaying:', this.displayedLogs.length, '/', this.filteredLogs.length);
  }

  // Search triggered
  searchLogs() {
    console.log('Search triggered:', this.searchText);
    this.applyFiltersAndSearch();
    this.scrollToTop();
  }

  // Apply filter button
  applyFilter() {
    console.log('Filter applied');
    this.applyFiltersAndSearch();
    this.scrollToTop();
  }

  // Reset filter button
  resetFilter() {
    this.fromDate = '';
    this.toDate = '';
    this.selectedModule = 'All';
    this.searchText = '';
    console.log('Filters reset');
    this.applyFiltersAndSearch();
    this.scrollToTop();
  }

  // Scroll to top of container
  scrollToTop() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = 0;
    }
  }

  // Export logs
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

  // Load summary cards
  loadSummaryCards() {
    this.api.getAuditSummaryCards().subscribe({
      next: (res) => {
        console.log('SUMMARY CARDS:', res);
        this.summary = res;
      },
      error: (err) => console.error(err)
    });
  }

  // Check if more items available
  get hasMoreItems(): boolean {
    return this.currentDisplayCount < this.filteredLogs.length;
  }
}