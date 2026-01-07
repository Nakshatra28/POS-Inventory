import { Component, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supplierpopup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './supplierpopup.component.html',
  styleUrl: './supplierpopup.component.css'
})
export class SupplierpopupComponent {
@Output() close = new EventEmitter<void>();
@Output() supplierAdded = new EventEmitter<void>();
constructor(private api: ApiService) {}
supplier ={
  name:'',
  phone:'',
  email:'',
   contactPerson: '', 
  status:'active',
}


onClose() {
  this.close.emit();
}

saveSuppllier() {

  

  if (!this.supplier.name || !this.supplier.phone || !this.supplier.email) {
    alert('Need to fill all required fields');
    return;
  }

  this.api.createSupplier(this.supplier).subscribe({
    next: () => {
       this.supplierAdded.emit(); // 🔥 tell parent
      this.close.emit();
    },
    error: () => {
      alert('Failed to add supplier');
    }
  });

}


}
