import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [],
  templateUrl: './tracking.html',
  styleUrl: './tracking.css'
})
export class Tracking implements AfterViewInit {

  map!: L.Map;

  ngAfterViewInit(): void {

    this.map = L.map('map').setView([28.6315, 77.2167], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.map);

    // Restaurant
    L.marker([28.6315, 77.2167])
      .addTo(this.map)
      .bindPopup("🍔 Restaurant");

    // Customer
    L.marker([28.6735, 77.2890])
      .addTo(this.map)
      .bindPopup("🏠 Customer");
  }

}
