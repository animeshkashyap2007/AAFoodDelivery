import { Component, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    HttpClientModule
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
        text: 'Please enter Username and Password'
      });
      return;
    }

    this.authService.login({

      username: this.email,
      password: this.password

    }).subscribe({

      next: (res: any) => {

        this.authService.saveToken(res.token);

        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'Welcome Admin!',
          timer: 1500,
          showConfirmButton: false
        });

        this.router.navigate(['/']);

      },

      error: () => {

        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid Username or Password'
        });

      }

    });

  }

}
