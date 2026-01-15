import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LedgerComponent } from "./ledger/ledger.component";

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [FormsModule, CommonModule, LedgerComponent],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent implements OnInit {

  constructor(private api: ApiService) {}

  // 🔹 Table data
  accountsList: any[] = [];
  filteredAccounts: any[] = [];

  // 🔹 UI states
  isLoadingAccounts = false;
  searchText = '';


  // 🔹 Top cards
  accountSummary = {
    totalSales: 0,
    stockValue: 0,
    outstandingAmount: 0,
    totalPaid: 0,   
    activeCustomers: 0
  };

  ngOnInit() {
    this.loadAccountSummary();
    this.loadAccountsList();
   
  }

  // 🔹 Summary API
  loadAccountSummary() {
    this.api.getAccountSummary().subscribe({
      next: (res) => {
        this.accountSummary = res;
        console.log('Account Summary:', res);
      },
      error: (err) => {
        console.error('Failed to load account summary', err);
      }
    });
  }

  // 🔹 Accounts table API
  loadAccountsList() {
    this.isLoadingAccounts = true;

    this.api.getAccountsList().subscribe({
      next: (res) => {
        this.accountsList = res;
        this.filteredAccounts = res; 
        this.isLoadingAccounts = false;
        console.log('Accounts List:', res);
      },
      error: (err) => {
        console.error('Failed to load accounts list', err);
        this.isLoadingAccounts = false;
      }
    });
  }

  //  Search logic
  searchAccounts() {
    const text = this.searchText.trim().toLowerCase();

    if (!text) {
      this.filteredAccounts = this.accountsList;
      return;
    }

    this.filteredAccounts = this.accountsList.filter(acc =>
      acc.code?.toLowerCase().includes(text) ||
      acc.name?.toLowerCase().includes(text) ||
      acc.category?.toLowerCase().includes(text)
    );
  
  }
showLedgerPopup = false;
selectedAccount: any = null;
ledgerList: any[] = [];
isLedgerLoading = false;



  viewLedger(acc: any) {
  this.selectedAccount = acc;
  this.showLedgerPopup = true;
  this.loadLedger(acc.code);
}


loadLedger(code: string) {
  this.isLedgerLoading = true;

  this.api.getAccountLedger(code).subscribe({
    next: (res) => {
      this.ledgerList = res;
      this.isLedgerLoading = false;
      console.log('Ledger:', res);
    },
    error: (err) => {
      console.error('Failed to load ledger', err);
      this.isLedgerLoading = false;
    }
  });
}



}
