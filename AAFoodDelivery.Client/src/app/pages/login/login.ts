import { Component, inject, AfterViewInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements AfterViewInit {

  private router = inject(Router);
  private authService = inject(AuthService);

  email = '';
  password = '';
  showPassword = false;

  ngAfterViewInit(): void {

    // Check if Google Identity Services is loaded
    if (typeof google === 'undefined') {
      console.error('Google Identity Services not loaded.');
      return;
    }

    google.accounts.id.initialize({
      client_id: '481638960684-lsljfoukqtbk5ojggn0v9a8femo47f3h.apps.googleusercontent.com',

      callback: (response: any) => {

        this.authService.googleLogin(response.credential).subscribe({

          next: (res: any) => {

            localStorage.setItem('token', res.token);
            localStorage.setItem('role', res.role);
            localStorage.setItem('userId', res.id.toString());
            localStorage.setItem('name', res.name);

            Swal.fire({
              icon: 'success',
              title: 'Google Login Successful',
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
              title: 'Google Login Failed',
              text: err.error?.message || 'Unable to login with Google'
            });

          }

        });

      }

    });

    const googleButton = document.getElementById('googleButton');

    if (googleButton) {
      google.accounts.id.renderButton(googleButton, {
        theme: 'outline',
        size: 'large',
        width: 300
      });
    }

  }

  login(): void {

    if (!this.email || !this.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please enter email and password.'
      });
      return;
    }

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({

      next: (res: any) => {

        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('userId', res.id.toString());
        localStorage.setItem('name', res.name);

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

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

}
