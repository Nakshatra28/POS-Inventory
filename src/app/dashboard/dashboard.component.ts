import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  /* ---------------- CHART REFERENCES ---------------- */
  @ViewChild('salesChart') salesChart?: BaseChartDirective;
  @ViewChild('inventoryChart') inventoryChart?: BaseChartDirective;

  /* ---------------- SUMMARY CARDS ---------------- */
  summary = {
    totalSales: 0,
    stockValue: 0,
    outstandingPayment: 0,
    activeCustomers: 0
  };

  recentActivities: any[] = [];
  lowStockProducts: any[] = [];
lowStockCount = 0;

  constructor(private api: ApiService) {}

  /* ================= SALES & PURCHASES (LINE) ================= */

  salesPurchaseChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      { label: 'Sales', data: [], borderWidth: 2, tension: 0.4 },
      { label: 'Purchases', data: [], borderWidth: 2, tension: 0.4 }
    ]
  };

  salesPurchaseChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: { legend: { display: true } }
  };

  /* ================= INVENTORY (DONUT) ================= */

  inventoryCategoryChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#22c55e',
          '#3b82f6',
          '#f97316',
          '#a855f7',
          '#ef4444'
        ],
        borderWidth: 0
      }
    ]
  };

  inventoryCategoryChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    cutout: '65%',
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  /* ================= LIFECYCLE ================= */

  ngOnInit(): void {
    this.loadDashboardSummary();
    this.loadRecentActivity();
    this.loadSalesPurchaseChart();
    this.loadInventoryCategoryChart();
     this.loadLowStockAlerts(); 
  }

  /* ================= SUMMARY ================= */

  loadDashboardSummary() {
    this.api.getAuditSummaryCards().subscribe(res => {
      this.summary = res;
    });
  }

  /* ================= RECENT ACTIVITY ================= */

  loadRecentActivity() {
    this.api.getRecentAuditLogs().subscribe({
      next: (res: any) => this.recentActivities = res?.data || [],
      error: () => this.recentActivities = []
    });
  }

  /* ================= SALES & PURCHASE CHART ================= */

  loadSalesPurchaseChart() {
    const monthlySales: Record<string, number> = {};
    const monthlyPurchases: Record<string, number> = {};

    this.api.getInvoices().subscribe((res: any) => {
      const invoices = res?.data || res || [];

      invoices.forEach((inv: any) => {
        const date = new Date(inv.createdAt || inv.invoiceDate || inv.date);
        const key = `${date.getFullYear()}-${date.getMonth()}`;

        monthlySales[key] =
          (monthlySales[key] || 0) +
          Number(inv.totalAmount || inv.grandTotal || inv.amount || 0);
      });

      this.updateSalesChart(monthlySales, monthlyPurchases);
    });

    this.api.getPurchaseOrders().subscribe((res: any) => {
      const purchases = res?.data || res || [];

      purchases.forEach((po: any) => {
        const date = new Date(po.createdAt || po.purchaseDate || po.date);
        const key = `${date.getFullYear()}-${date.getMonth()}`;

        monthlyPurchases[key] =
          (monthlyPurchases[key] || 0) +
          Number(po.totalAmount || po.grandTotal || po.amount || 0);
      });

      this.updateSalesChart(monthlySales, monthlyPurchases);
    });
  }

  updateSalesChart(
    sales: Record<string, number>,
    purchases: Record<string, number>
  ) {
    const months = Array.from(
      new Set([...Object.keys(sales), ...Object.keys(purchases)])
    ).sort();

    this.salesPurchaseChartData.labels = months.map(m => {
      const [y, mo] = m.split('-');
      return new Date(+y, +mo).toLocaleString('default', { month: 'short' });
    });

    this.salesPurchaseChartData.datasets[0].data = months.map(m => sales[m] || 0);
    this.salesPurchaseChartData.datasets[1].data = months.map(m => purchases[m] || 0);

    setTimeout(() => this.salesChart?.update());
  }

  /* ================= INVENTORY DONUT ================= */

  loadInventoryCategoryChart() {
    this.api.getAuditSummaryCards().subscribe((res: any) => {
      const categoryStock = res.categoryStock || {};

      this.inventoryCategoryChartData = {
        labels: Object.keys(categoryStock),
        datasets: [
          {
            data: Object.values(categoryStock),
            backgroundColor: [
              '#22c55e',
              '#3b82f6',
              '#f97316',
              '#a855f7',
              '#ef4444'
            ],
            borderWidth: 0
          }
        ]
      };

      setTimeout(() => this.inventoryChart?.update());
    });
  }

  loadLowStockAlerts() {
  this.api.getLowStockSummary().subscribe({
    next: (res: any) => {
      this.lowStockCount = res.count;
      this.lowStockProducts = res.products;
    },
    error: () => {
      this.lowStockCount = 0;
      this.lowStockProducts = [];
    }
  });
}

}
