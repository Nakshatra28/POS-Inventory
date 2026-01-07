import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ledger',
  standalone: true,
  imports: [DatePipe,CommonModule],
  templateUrl: './ledger.component.html',
  styleUrl: './ledger.component.css'
})
export class LedgerComponent {

    @Input() account: any;
  @Input() ledgerList: any[] = [];
  @Input() isLoading = false;

  @Output() close = new EventEmitter<void>();

}
