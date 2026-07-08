import { Component, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  private router = inject(Router);

  user = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  };

  showPassword = false;

  register() {

    if (
      !this.user.name ||
      !this.user.email ||
      !this.user.phone ||
      !this.user.password ||
      !this.user.confirmPassword
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Details',
        text: 'Please fill all fields.'
      });
      return;
    }

    if (this.user.password !== this.user.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'Registration Successful',
      text: 'Your account has been created.',
      timer: 1500,
      showConfirmButton: false
    });

    this.router.navigate(['/login']);

  }

}
