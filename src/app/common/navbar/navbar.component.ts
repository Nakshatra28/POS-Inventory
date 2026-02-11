import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  @Output() toggle = new EventEmitter<void>();

  constructor(private router: Router) {}  // ✅ Router injected here

userName: string = '';
userRole: string = '';
avatarLetter: string = '';

ngOnInit() {
  this.userName = localStorage.getItem('userName') || '';
  this.userRole = localStorage.getItem('userRole') || '';

  if (this.userName) {
    this.avatarLetter = this.userName.charAt(0).toUpperCase();
  }
}

  toggleSidebar() {
    this.toggle.emit();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
