import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7188/api/Food';

  private orderApi = 'https://localhost:7188/api/Orders';

  cart: any[] = [];

  placeOrder(userId: number, address: string) {

    const order = {
      userId: userId,
      address: address,
      totalAmount: this.getTotal(),
      items: this.cart.map(item => ({
        foodId: item.foodId,
        quantity: item.quantity,
        price: item.price
      }))
    };

    return this.http.post(this.orderApi, order);
  }

  getFoods(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUserOrders(userId: number) {
    return this.http.get<any[]>(`${this.orderApi}/user/${userId}`);
  }


  addToCart(food: any) {

    const item = this.cart.find(x => x.foodId === food.foodId);

    if (item) {
      item.quantity++;
    } else {
      this.cart.push({
        ...food,
        quantity: 1
      });
    }

  }

  getCart() {
    return this.cart;
  }

  increaseQuantity(index: number) {
    this.cart[index].quantity++;
  }

  decreaseQuantity(index: number) {

    if (this.cart[index].quantity > 1) {
      this.cart[index].quantity--;
    } else {
      this.removeFromCart(index);
    }

  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
  }

  getTotal(): number {

    return this.cart.reduce((total, item) =>
      total + (item.price * item.quantity), 0);

  }

}
