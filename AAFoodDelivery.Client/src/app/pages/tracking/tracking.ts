import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [],
  templateUrl: './tracking.html',
  styleUrl: './tracking.css'
})
export class Tracking implements AfterViewInit {

  progress = 0;
  minutes = 30;
  seconds = 0;
  status = 'Preparing Food';

  map!: L.Map;
  carMarker!: L.Marker;

  restaurant = L.latLng(28.6315, 77.2167);
  customer = L.latLng(28.6735, 77.2890);

  ngAfterViewInit(): void {

    this.map = L.map('map').setView([28.6315, 77.2167], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.map);

    // Restaurant Icon
    const restaurantIcon = L.icon({
      iconUrl: '/images/markers/restaurant.png',
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });

    // Customer Icon
    const homeIcon = L.icon({
      iconUrl: '/images/markers/home.png',
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });

    // Bike Icon
    const bikeIcon = L.icon({
      iconUrl: '/images/markers/bike.png',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    // Restaurant Marker
    L.marker(this.restaurant, {
      icon: restaurantIcon
    })
      .addTo(this.map)
      .bindPopup('🍔 Restaurant');

    // Customer Marker
    L.marker(this.customer, {
      icon: homeIcon
    })
      .addTo(this.map)
      .bindPopup('🏠 Customer');

    // Bike Marker
    this.carMarker = L.marker(this.restaurant, {
      icon: bikeIcon
    }).addTo(this.map);

    // Route Line
    (L as any).Routing.control({
      waypoints: [
        this.restaurant,
        this.customer
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      lineOptions: {
        styles: [
          {
            color: '#ff5722',
            weight: 6
          }
        ]
      }
    }).addTo(this.map);

    // Zoom to fit both markers
    const bounds = L.latLngBounds([
      this.restaurant,
      this.customer
    ]);

    this.map.fitBounds(bounds, {
      padding: [50, 50]
    });

    this.animateBike();
    this.startDelivery();
  }

  animateBike(): void {

    let progress = 0;

    const interval = setInterval(() => {

      progress += 0.002;

      if (progress >= 1) {
        clearInterval(interval);
        return;
      }

      const lat =
        this.restaurant.lat +
        (this.customer.lat - this.restaurant.lat) * progress;

      const lng =
        this.restaurant.lng +
        (this.customer.lng - this.restaurant.lng) * progress;

      this.carMarker.setLatLng([lat, lng]);

    }, 30);

  }

  startDelivery(): void {

    const timer = setInterval(() => {

      if (this.progress < 100) {
        this.progress += 1;
      }

      if (this.seconds === 0) {

        if (this.minutes > 0) {
          this.minutes--;
          this.seconds = 59;
        }

      } else {
        this.seconds--;
      }

      if (this.progress < 25) {
        this.status = 'Preparing Food';
      }
      else if (this.progress < 50) {
        this.status = 'Order Picked Up';
      }
      else if (this.progress < 90) {
        this.status = 'On the Way';
      }
      else {
        this.status = 'Almost Arrived';
      }

      if (this.progress >= 100) {
        this.status = 'Delivered';
        clearInterval(timer);
      }

    }, 1000);

  }

}
