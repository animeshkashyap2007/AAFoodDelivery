import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FoodService } from '../../services/food.service';
import { Component,inject,AfterViewInit,ChangeDetectorRef} from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements AfterViewInit {

  private foodService = inject(FoodService);
  private cdr = inject(ChangeDetectorRef);

  orderItems = this.foodService.getCart();

  orderId = 'ORD' + Math.floor(Math.random() * 9000 + 1000);
  orderDate: Date = new Date();

  deliveryCharge = 40;

  deliveryBoy = '';
  vehicle = '';
  vehicleNumber = '';

  minutes = 30;
  seconds = 0;

  progress = 0;
  status = 'Preparing Food';

  map!: L.Map;

  deliveryPartners = [
    {
      name: 'Anand Singh',
      vehicle: 'Honda Activa',
      number: 'DL 5S AB 1245'
    },
    {
      name: 'Aditya Mishra',
      vehicle: 'TVS Jupiter',
      number: 'DL 8C XY 6721'
    },
    {
      name: 'Aditya Mukharjee',
      vehicle: 'Hero Splendor',
      number: 'DL 3S LM 8812'
    },
    {
      name: 'Somil Sharma',
      vehicle: 'Honda Shine',
      number: 'DL 7T PQ 4578'
    },
    {
      name: 'Amit Bisht',
      vehicle: 'Bajaj Pulsar',
      number: 'DL 9R JK 3196'
    }
  ];



  ngAfterViewInit(): void {

    const partner =
      this.deliveryPartners[
      Math.floor(Math.random() * this.deliveryPartners.length)
      ];

    this.deliveryBoy = partner.name;
    this.vehicle = partner.vehicle;
    this.vehicleNumber = partner.number;

    this.cdr.detectChanges();

    setTimeout(() => {

      const mapElement = document.getElementById('map');

      if (!mapElement) {
        console.error('Map element not found');
        return;
      }

      this.map = L.map(mapElement).setView([28.6139, 77.2090], 12);

      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; OpenStreetMap contributors'
        }
      ).addTo(this.map);

      const marker = L.icon({
        iconUrl:
          'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:
          'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      });

      L.marker([28.6139, 77.2090], { icon: marker })
        .addTo(this.map)
        .bindPopup('🍴 A&A Food Delivery');

      L.marker([28.6280, 77.2180], { icon: marker })
        .addTo(this.map)
        .bindPopup('🏠 Customer');

    }, 300);

  }

  downloadInvoice() {

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('A&A FOOD DELIVERY', 14, 20);

    doc.setFontSize(12);
    doc.text(`Order ID: ${this.orderId}`, 14, 30);
    doc.text(`Date: ${this.orderDate.toLocaleString()}`, 14, 38);

    autoTable(doc, {
      startY: 48,
      head: [['Food Item', 'Qty', 'Price', 'Total']],
      body: this.orderItems.map(item => [
        item.food?.name ?? item.name,
        item.quantity,
        `₹${item.price}`,
        `₹${item.price * item.quantity}`
      ])
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.text(`Subtotal : ₹${this.getSubTotal()}`, 14, finalY);
    doc.text(`Delivery : ₹${this.deliveryCharge}`, 14, finalY + 8);

    doc.setFontSize(14);
    doc.text(`Grand Total : ₹${this.getGrandTotal()}`, 14, finalY + 20);

    doc.save(`Invoice-${this.orderId}.pdf`);

  }

  getSubTotal(): number {
    return this.orderItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
  }

  getGrandTotal(): number {
    return this.getSubTotal() + this.deliveryCharge;
  }

}
