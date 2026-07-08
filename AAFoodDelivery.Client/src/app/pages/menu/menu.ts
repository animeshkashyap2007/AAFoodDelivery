import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FoodService } from '../../services/food.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {

  private foodService = inject(FoodService);
  private cdr = inject(ChangeDetectorRef);

  foods: any[] = [];

  ngOnInit(): void {

    this.foodService.getFoods().subscribe({

      next: (data) => {

        console.log('Menu Data:', data);

        this.foods = [...data];

        this.cdr.detectChanges();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  addToCart(food: any) {

    this.foodService.addToCart(food);

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `${food.name} added to cart`,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true
    });

  }

}
