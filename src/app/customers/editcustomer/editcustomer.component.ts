import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editcustomer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './editcustomer.component.html',
  styleUrl: './editcustomer.component.css',
})
export class EditcustomerComponent {
  @Output() close = new EventEmitter<void>();
    @Input() data: any = null;
   @Output() updated = new EventEmitter<string>();
@Output() toast = new EventEmitter<string>();

     constructor(private api: ApiService) {}
 customer:any = {};
  isEditing = true;

ngOnChanges() {
  if (this.data) {
    this.customer = { ...this.data }; // clone to avoid mutation
  }
}

  closeEdit() {
    this.close.emit();
  }
  saveCustomer(){
    if(!this.customer.name || !this.customer.email || !this.customer.phone || !this.customer.status ){
       this.toast.emit('Please fill all required fields');
      return
    }
    if(this.data && this.data._id){
      this.updateCustomer();
    }else{
      this.createCustomer();
    }

    
  }
  createCustomer(){
    this.api.addCustomer(this.customer).subscribe((res:any) =>{
      if(res.success){
        this.toast.emit('Customer added successfully');
        this.close.emit();
      }
    });

  }


updateCustomer() {
  this.api.updateCustomer(this.customer._id, this.customer).subscribe(
    (res: any) => {
      if (res.success) {
      this.updated.emit('Customer updated successfully');

        setTimeout(() => {
          this.close.emit(); // 🔥 close AFTER toast
        }, 300);
      }
    },
    (error) => {
      console.error("UPDATE ERROR:", error);
      this.toast.emit('Failed to update customer');
    }
  );
}


}
