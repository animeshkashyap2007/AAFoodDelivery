import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FoodService } from '../../services/food.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  private authService = inject(AuthService);
  private foodService = inject(FoodService);
  private router = inject(Router);

  get cartCount(): number {
    return this.foodService.getCart().length;
  }

  isLoggedIn(): boolean {
    return this.authService.getToken() !== null;
  }

  logout() {

    this.authService.logout();

    Swal.fire({
      icon: 'success',
      title: 'Logged Out',
      text: 'See you again!',
      timer: 1500,
      showConfirmButton: false
    });

    this.router.navigate(['/login']);

  }

}
