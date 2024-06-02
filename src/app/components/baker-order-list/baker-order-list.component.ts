import { Component } from '@angular/core';
import { Order } from '../../models/orders/order.model';
import { OrderService } from '../../services/orders/order.service';
import { catchError, of } from 'rxjs';
import { OrderStatus } from '../../enums/order-status';

@Component({
  selector: 'app-baker-order-list',
  templateUrl: './baker-order-list.component.html',
  styleUrl: './baker-order-list.component.scss'
})
export class BakerOrderListComponent {
  orderList: Order[] = [];
  visibleOrderDetails: Set<number> = new Set();

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }


  loadOrders() {
    this.orderService.getOrdersByBaker().pipe(
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

  completeOrder(orderId: number) {
    this.orderService.completeOrderByBaker(orderId).subscribe({
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
