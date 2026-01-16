import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
sidebarOpen = false;
  @Output() toggle = new EventEmitter<void>();
  toggleSidebar() {
        this.toggle.emit();

  // emit event to parent layout
}
}
