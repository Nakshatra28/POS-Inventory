import { Component, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-customerpopup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './customerpopup.component.html',
  styleUrl: './customerpopup.component.css'
})
export class CustomerpopupComponent {

@Output() toast = new EventEmitter<string>();

  @Output() close = new EventEmitter<void>();
constructor(private api: ApiService) {}
  closePopup() {
    this.close.emit();
  }

  customer = {
  name: '',
  phone: '',
  email: '',
  status: 'active', 
  address: ''
};

saveCustomer() {


  if (!this.customer.name || !this.customer.email) {
    this.toast.emit('Name and email are required');
    return;
  }

  this.api.addCustomer(this.customer).subscribe({
    next: () => {
      this.close.emit();  
    },
    error: (err) => {
     this.toast.emit('Failed to add customer');
      console.error(err);
    }
  });
}
}
