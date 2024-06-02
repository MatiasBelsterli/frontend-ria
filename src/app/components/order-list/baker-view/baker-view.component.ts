import { Component, OnInit } from '@angular/core';
import { Order } from '../../../models/orders/order.model';
import { OrderStatus } from '../../../enums/order-status';
import { OrderService } from '../../../services/orders/order.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-baker-view',
  templateUrl: './baker-view.component.html',
  styleUrl: './baker-view.component.scss'
})
export class BakerViewComponent implements OnInit {
  orderList: Order[] = [];
  visibleOrderDetails: Set<number> = new Set();

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }


  loadOrders() {
    this.orderService.getOrdersToBakers().pipe(
      catchError(err => {
        console.error('Error getting orders', err);
        return of([]);
      })
    ).subscribe({
      next: orders => {
        this.orderList = orders;
        console.log('Orders loaded successfully', orders);
      },
      error: error => {
        console.error('Error subscribing to orders', error);
      }
    });
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

  takeOrder(orderId: number) {
    this.orderService.takeOrderToBaker(orderId).subscribe({
      next: updatedOrder => {
        const index = this.orderList.findIndex(order => order.id === orderId);
        if (index !== -1) {
          this.orderList[index].status = updatedOrder.status;
        }
        console.log('Order status updated successfully', updatedOrder);
      },
      error: error => {
        console.error('Error updating order status', error);
      }
    });
  }

  protected readonly OrderStatus = OrderStatus;
}
