import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { roleGuard } from './guards/role.guard';

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

  // ================= ADMIN ONLY ROUTES =================

  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard, roleGuard],
    data: { role: 'ADMIN' }
  },

  { 
    path: 'product', 
    component: ProductManagementComponent, 
    canActivate: [AuthGuard, roleGuard],
    data: { role: 'ADMIN' }
  },

  { 
    path: 'stock', 
    component: StockManagementComponent, 
    canActivate: [AuthGuard, roleGuard],
    data: { role: 'ADMIN' }
  },

  { 
    path: 'supplier', 
    component: SupplierComponent, 
    canActivate: [AuthGuard, roleGuard],
    data: { role: 'ADMIN' }
  },

  { 
    path: 'audit-log', 
    component: AuditLogsComponent, 
    canActivate: [AuthGuard, roleGuard],
    data: { role: 'ADMIN' }
  },

  { 
    path: 'account', 
    component: AccountsComponent, 
    canActivate: [AuthGuard, roleGuard],
    data: { role: 'ADMIN' }
  },

  // ================= AUTHENTICATED USERS =================

  { 
    path: 'invoice', 
    component: InvoicesComponent, 
    canActivate: [AuthGuard]
  },

  { 
    path: 'purches', 
    component: PurchesOrderComponent, 
    canActivate: [AuthGuard]
  },

  { 
    path: 'customer', 
    component: CustomersComponent, 
    canActivate: [AuthGuard]
  },

  { 
    path: 'payment', 
    component: PaymentsComponent, 
    canActivate: [AuthGuard]
  }

];
