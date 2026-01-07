    import { Routes } from '@angular/router';
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
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

    { path: 'dashboard', component: DashboardComponent },
    { path: 'product', component: ProductManagementComponent },
    { path: 'stock', component: StockManagementComponent },
    { path: 'supplier', component: SupplierComponent },
    {path:'invoice',component:InvoicesComponent},
    {path:'purches',component:PurchesOrderComponent},
    {path:'customer',component:CustomersComponent},
    {path:'payment',component:PaymentsComponent},
    {path:'audit-log',component:AuditLogsComponent},
    {path:'account',component:AccountsComponent}
    ];
