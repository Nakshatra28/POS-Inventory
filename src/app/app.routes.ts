import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { StockManagementComponent } from './stock-management/stock-management.component';
import { SupplierComponent } from './supplier/supplier.component';
import { CustomersComponent } from './customers/customers.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { PurchesOrderComponent } from './purches-order/purches-order.component';
import { PaymentsComponent } from './payments/payments.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { AccountsComponent } from './accounts/accounts.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'product', component: ProductManagementComponent, canActivate: [AuthGuard] },
  { path: 'stock', component: StockManagementComponent, canActivate: [AuthGuard] },
  { path: 'supplier', component: SupplierComponent, canActivate: [AuthGuard] },
  { path: 'invoice', component: InvoicesComponent, canActivate: [AuthGuard] },
  { path: 'purches', component: PurchesOrderComponent, canActivate: [AuthGuard] },
  { path: 'customer', component: CustomersComponent, canActivate: [AuthGuard] },
  { path: 'payment', component: PaymentsComponent, canActivate: [AuthGuard] },
  { path: 'audit-log', component: AuditLogsComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountsComponent, canActivate: [AuthGuard] }
];
