import { Component, OnInit } from '@angular/core';
import { Order } from '../../../models/orders/order.model';
import { OrderService } from '../../../services/orders/order.service';
import { catchError, of } from 'rxjs';
import { OrderStatus } from '../../../enums/order-status';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.scss'
})
export class UserViewComponent implements OnInit {
  orderList: Order[] = [];
  visibleOrderDetails: Set<number> = new Set();

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrdersByUser().pipe(
      catchError(err => {
        console.error('Error getting orders', err);
        return of([]);
      })
    ).subscribe({
      next: orders => {
        this.orderList = orders;
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

  changeOrderStatus(orderId: number, status: OrderStatus) {
    this.orderService.changeOrderStatus(orderId, status).subscribe(
      updatedOrder => {
        const index = this.orderList.findIndex(order => order.id === orderId);
        if (index !== -1) {
          this.orderList[index].status = updatedOrder.status;
        }
        console.log('Order status updated successfully', updatedOrder);
      },
      error => {
        console.error('Error updating order status', error);
      }
    );
  }

  protected readonly OrderStatus = OrderStatus;
}
