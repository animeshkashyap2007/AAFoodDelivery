import { Routes } from '@angular/router';
import { Tracking } from './pages/tracking/tracking';
import { Home } from './pages/home/home';
import { Menu } from './pages/menu/menu';
import { FoodDetails } from './pages/food-details/food-details';
import { Cart } from './pages/cart/cart';
import { Checkout } from './pages/checkout/checkout';
import { Orders } from './pages/orders/orders';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Contact } from './pages/contact/contact';

export const routes: Routes = [

  { path: '', component: Home },

  { path: 'menu', component: Menu },

  { path: 'food/:id', component: FoodDetails },

  { path: 'cart', component: Cart },

  { path: 'checkout', component: Checkout },

  { path: 'orders', component: Orders },

  { path: 'login', component: Login },

  { path: 'register', component: Register },

  { path: 'contact', component: Contact },

  { path: 'tracking', component: Tracking },

  { path: '**', redirectTo: '' }
];
