import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  login() {
    this.loading = true;
    this.error = '';

    this.api.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        // save token
        localStorage.setItem('token', res.token);

        // go to products or dashboard
      this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed';
        this.loading = false;
      }
    });
  }
}
