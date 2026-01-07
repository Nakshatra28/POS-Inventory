
 import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
  import { ApiService } from '../../service/api.service';
  import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-supplieredit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './supplieredit.component.html',
  styleUrl: './supplieredit.component.css'
})
export class SuppliereditComponent {
  @Output() close = new EventEmitter<void>();
@Output() supplierUpdated = new EventEmitter<void>();

@Output() supplierUpdateError = new EventEmitter<string>();


  constructor(private api: ApiService) {}
  supplier ={
    name:'',
    phone:'',
    email:'',
     contactPerson: '', 
    status:'active',
  }
  supplierId: string | null = null;
  
    @Input() data: any;
ngOnInit(){
  console.log( "svae supp",this.data)

}

 // 🔥 THIS IS THE KEY FIX
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      this.supplier = { ...this.data };   // populate form
      this.supplierId = this.data._id;    // store id
      console.log('Supplier edit data:', this.supplier);
    }
  }

  
  onClose() {
    this.close.emit();
  }
  
 saveSuppllier() {
  if (!this.supplier.name || !this.supplier.phone || !this.supplier.email) {
    this.supplierUpdateError.emit('All required fields must be filled');
    return;
  }

  if (this.supplierId) {
    this.api.updateSupplier(this.supplierId, this.supplier).subscribe({
      next: () => {
        this.supplierUpdated.emit();   // ✅ success
        this.close.emit();
      },
      error: () => {
        this.supplierUpdateError.emit('Failed to update supplier'); // ❌ error
      }
    });
  }
}


  
  }
  
