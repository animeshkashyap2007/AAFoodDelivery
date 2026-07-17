import { Component, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private router = inject(Router);
  private authService = inject(AuthService);

  email = '';
  password = '';
  showPassword = false;

  login() {

    if (!this.email || !this.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Details',
        text: 'Please enter Email and Password'
      });
      return;
    }

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({

      next: (res: any) => {

        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: `Welcome ${res.name}!`,
          timer: 1500,
          showConfirmButton: false
        });

        if (res.role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }

      },

      error: (err) => {

        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: err.error?.message || 'Invalid Email or Password'
        });

      }

    });

  }

}
