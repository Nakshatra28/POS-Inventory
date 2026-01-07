  import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

  @Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule,RouterLinkActive,RouterLink],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
  })

  export class SidebarComponent {
    showproduct=false;
    showsupplier=false;
  
    showstock=false;
    showdashboard=false;  
    showreport=false;

    // toggleproduct(){
    //   this.showproduct =!this.showproduct;
    // }

     
    // togglestock(){
    //   this.showstock =!this.showstock;

    // }
       
    // tooglesupplier(){
    //   this.showsupplier =!this.showsupplier;
    // }
    


     
    // toggledashboard(){
    //   this.showdashboard =!this.showdashboard;
    // }


    // togglereport(){
    //   this.showreport =!this.showreport;
    // }


  }
