import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FoodService } from '../../services/food.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {

  private foodService = inject(FoodService);
  private router = inject(Router);

  cartItems = this.foodService.getCart();

  customer = {
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    payment: 'Cash on Delivery'
  };

  getSubTotal(): number {
    return this.foodService.getTotal();
  }

  getDeliveryCharge(): number {
    return 40;
  }

  getGrandTotal(): number {
    return this.getSubTotal() + this.getDeliveryCharge();
  }

  placeOrder() {

    if (
      !this.customer.name ||
      !this.customer.phone ||
      !this.customer.address ||
      !this.customer.city ||
      !this.customer.pincode
    ) {

      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Details',
        text: 'Please fill all details before placing your order.'
      });

      return;
    }

    // TODO: Replace with the actual logged-in user's ID from your auth system
    const userId = 1;

    const fullAddress =
      `${this.customer.address}, ${this.customer.city} - ${this.customer.pincode}`;

    this.foodService.placeOrder(userId, fullAddress).subscribe({

      next: () => {

        //this.foodService.cart = [];

        Swal.fire({
          icon: 'success',
          title: 'Order Placed Successfully!',
          text: 'Thank you for ordering from A&A Food Delivery.',
          confirmButtonColor: '#f59e0b',
          confirmButtonText: 'View Orders'
        }).then(() => {

          this.router.navigate(['/orders']);

        });

      },

      error: (err) => {

        console.error(err);

        Swal.fire({
          icon: 'error',
          title: 'Order Failed',
          text: 'Unable to place your order. Please try again.'
        });

      }

    });

  }

}
