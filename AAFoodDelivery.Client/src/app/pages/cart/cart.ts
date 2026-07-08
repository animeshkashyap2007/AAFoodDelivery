import { Component, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FoodService } from '../../services/food.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {

  private foodService = inject(FoodService);

  cartItems = this.foodService.getCart();

  deliveryCharge = 40;

  increase(index: number) {
    this.foodService.increaseQuantity(index);
  }

  decrease(index: number) {
    this.foodService.decreaseQuantity(index);
  }

  remove(index: number) {

    Swal.fire({
      title: 'Remove Item?',
      text: 'Do you want to remove this item from your cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Remove'
    }).then((result) => {

      if (result.isConfirmed) {

        this.foodService.removeFromCart(index);

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Item removed',
          showConfirmButton: false,
          timer: 1500
        });

      }

    });

  }

  getSubTotal(): number {
    return this.foodService.getTotal();
  }

  getGrandTotal(): number {
    return this.getSubTotal() + this.deliveryCharge;
  }

}
