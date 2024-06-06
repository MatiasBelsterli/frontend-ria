import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Order} from "../../../models/orders/order.model";
import {OrderService} from "../../../services/orders/order.service";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrl: './admin-view.component.scss'
})
export class AdminViewComponent implements OnInit {
  orderList$!: Observable<Order[]>;
  hasError: boolean = false;
  visibleOrderDetails: Set<number> = new Set();

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.loadOrders();
    this.orderList$.subscribe({
      next: value => {
        console.log('value', value)
      },
      error: error => {
        console.error(error)
      }
    })
  }

  loadOrders() {
    this.orderList$ = this.orderService.getOrdersByUser().pipe(catchError(err => {
      console.error('Error getting orders', err);
      this.hasError = true;
      return [];
    }));
  }

  toggleOrderDetails(index: number) {
    if (this.visibleOrderDetails.has(index)) {
      this.visibleOrderDetails.delete(index);
    } else {
      this.visibleOrderDetails.add(index);
    }
  }

  isOrderDetailsVisible(index: number): boolean {
    return this.visibleOrderDetails.has(index);
  }
}
