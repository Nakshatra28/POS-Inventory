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
@Output() toast = new EventEmitter<string>();
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
this.toast.emit('Please fill all required fields');
    return;
  }

  this.api.createSupplier(this.supplier).subscribe({
    next: () => {
       this.supplierAdded.emit();  
      this.close.emit();
    },
    error: () => {
 this.toast.emit('Failed to add supplier');
    }
  });

}


}
