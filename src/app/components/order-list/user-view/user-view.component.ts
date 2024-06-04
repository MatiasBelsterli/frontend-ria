import { Component, OnInit } from '@angular/core';
import { Order } from '../../../models/orders/order.model';
import { OrderService } from '../../../services/orders/order.service';
import { Observable } from 'rxjs';
import { catchError } from "rxjs/operators";
import {OrderStatus} from "../../../enums/order-status";

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.scss'
})
export class UserViewComponent implements OnInit {
  orderList$!: Observable<Order[]>;
  hasError: boolean = false;

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderList$ = this.orderService.getOrdersByUser().pipe(catchError(err => {
      console.error('Error getting orders', err);
      this.hasError = true;
      return [];
    }));
  }

  changeOrderStatus(event: { orderId: number, status: OrderStatus }) {
    this.orderService.changeOrderStatus(event.orderId, event.status).subscribe({
      next: () => {
        this.loadOrders()
      },
      error: (err) => {
        console.error('Error changing order status', err);
      }
    });
  }

}
