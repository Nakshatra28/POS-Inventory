  import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

  @Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule,RouterLinkActive,RouterLink],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
  })

  export class SidebarComponent {
      @Output() close = new EventEmitter<void>();

  closeSidebar() {
    this.close.emit();
  }
userRole: string | null = null;

ngOnInit() {
  const token = localStorage.getItem('token');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    this.userRole = payload.role;
  }
}


  }
