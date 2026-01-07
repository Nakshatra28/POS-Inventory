import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  addProduct(data: any) {
    return this.http.post('http://localhost:5000/api/products/add', data);
  }

  getProducts() {
    return this.http.get('http://localhost:5000/api/products/list');
  }

  // ---------------- CUSTOMERS ----------------
  addCustomer(data: any) {
    return this.http.post('http://localhost:5000/api/customer', data);
  }

  getCustomers() {
    return this.http.get('http://localhost:5000/api/customer');
  }

  updateCustomer(id: string, data: any) {
    return this.http.put(`http://localhost:5000/api/customer/${id}`, data);
  }

  deleteCustomer(ids: string[]) {
    return this.http.request('delete', 'http://localhost:5000/api/customer', {
      body: { ids },
    });
  }

  deleteProducts(ids: string[]) {
    return this.http.request('delete', 'http://localhost:5000/api/products', {
      body: { ids },
    });
  }
  updateProduct(id: string, data: any) {
    return this.http.put(`http://localhost:5000/api/products/${id}`, data);
  }

  createSupplier(data: any) {
    return this.http.post('http://localhost:5000/api/supplier', data);
  }

  getAllSupplier() {
    return this.http.get<any[]>('http://localhost:5000/api/supplier');
  }


  deleteSupplier(ids: string[]) {
  return this.http.request(
    'delete',
    'http://localhost:5000/api/supplier',
    {
      body: { ids },
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}



updateSupplier(id: string, data: any) {
  return this.http.put(`http://localhost:5000/api/supplier/${id}`, data);
}

  // ---------------- INVOICES ----------------

  // get all invoices
  getInvoices() {
    return this.http.get<any>('http://localhost:5000/api/invoice');
  }

  // create invoice
  createInvoice(data: any) {
    return this.http.post('http://localhost:5000/api/invoice', data);
  }

  // delete invoices (already present)
  deleteInvoice(ids: string[]) {
    return this.http.request('delete', 'http://localhost:5000/api/invoice', {
      body: { ids },
    });
  }

  updateInvoice(id: string, payload: any) {
    return this.http.put(`http://localhost:5000/api/invoice/${id}`, payload);
  }

  // api.service.ts
  createPurchaseOrder(payload: any) {
    return this.http.post('http://localhost:5000/api/purchase-orders', payload);
  }

  getPurchaseOrders() {
    return this.http.get('http://localhost:5000/api/purchase-orders');
  }
deletePurchaseOrder(id: string) {
  return this.http.delete(
    `http://localhost:5000/api/purchase-orders/${id}`
  );
}

updatePurchaseOrder(id: string, payload: any) {
  return this.http.put(
   `http://localhost:5000/api/purchase-orders/${id}`,
    payload
  );
}



getPayments() {
  return this.http.get<any[]>('http://localhost:5000/api/payments');
}

createPayment(data: any) {
  return this.http.post('http://localhost:5000/api/payments', data);
}

  // 🔹 ACCOUNTS SUMMARY
  getAccountSummary() {
    return this.http.get<any>('http://localhost:5000/api/accounts/summary');
  }

  getAccountsList() {
  return this.http.get<any[]>(
    'http://localhost:5000/api/accounts/list'
  );
}

getAccountLedger(code: string) {
  return this.http.get<any[]>(
    `http://localhost:5000/api/accounts/ledger/${code}`
  );
}

getAuditLogs() {
  return this.http.get<any[]>('http://localhost:5000/api/audit-logs');
}

getAuditLogsFiltered(params: any) {
  return this.http.get<any>(
    'http://localhost:5000/api/audit-logs',
    { params }
  );
}
exportAuditLogs(params: any) {
  return this.http.get(
    'http://localhost:5000/api/audit-logs/export',
    {
      params,
      responseType: 'blob'
    }
  );
}


// ---------------- AUDIT SUMMARY ----------------
getAuditSummaryCards() {
  return this.http.get<{
    totalSales: number;
    stockValue: number;
    outstandingPayment: number;
    activeCustomers: number;
  }>('http://localhost:5000/api/audit/summary-cards');
}


receivePurchaseOrder(id: string) {
  return this.http.put(
    `http://localhost:5000/api/purchase-orders/${id}/receive`,
    {}
  );
}

getStockMovements() {
  return this.http.get<any[]>(
    'http://localhost:5000/api/stock-movements'
  );
}

getStockSummary() {
  return this.http.get<any>(
    'http://localhost:5000/api/stock-movements/summary'
  );
}
getLowStockCount() {
  return this.http.get<any>(
    'http://localhost:5000/api/products/low-stock'
  );
}

getPendingStock() {
  return this.http.get<any>('http://localhost:5000/api/purchase-orders/pending/stock');
}



adjustStock(data: any) {
  return this.http.post(
    'http://localhost:5000/api/stock-movements/adjust',
    data
  );
}

// ---------------- DASHBOARD ----------------
getRecentAuditLogs() {
  return this.http.get<any>(
    'http://localhost:5000/api/audit-logs',
    {
      params: {
        page: 1,
        limit: 5
      }
    }
  );
}


getLowStockSummary() {
  return this.http.get<any>(
    'http://localhost:5000/api/products/low-stock'
  );
}

}



