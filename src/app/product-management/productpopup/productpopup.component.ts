import { Component, EventEmitter, Output, Input } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-productpopup',
  standalone: true,
  imports:[FormsModule],  
  templateUrl: './productpopup.component.html',
  styleUrls: ['./productpopup.component.css']
})
export class ProductpopupComponent {

  @Output() close = new EventEmitter<void>();
  @Input() data: any = null;
constructor(private api: ApiService) {}
  onClose() {
    this.close.emit();
  }
product = {
  sku: '',
  category: '',
  name: '',
  description: '',
  cost: null,
  price: null,
  stock: null,
  minStock: null,
  maxStock: null
};
  addproduct(){
    console.log('sending product to API:', this.product);
    if(!this.product.name||!this.product.sku ||!this.product.price){
      alert("Please fill required fields");
      return;

    }

this.api.addProduct(this.product).subscribe(
  
  (res:any)=>{
    if(res.success){
        console.log('API response:', res);
      alert("Product added Successfully");
      this.close.emit();
    }
    
    

  }
)

      console.log(this.addproduct)

  }

}
