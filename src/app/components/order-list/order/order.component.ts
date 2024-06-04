import {Component, EventEmitter, Input, Output} from '@angular/core';
import {OrderStatus} from "../../../enums/order-status";
import {Order} from "../../../models/orders/order.model";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent {
  @Input({required:true}) order!: Order;
  @Output() changeOrderStatus = new EventEmitter<{ orderId: number, status: OrderStatus }>();

  visibleOrderDetails: boolean = false;

  toggleOrderDetails() {
    this.visibleOrderDetails = !this.visibleOrderDetails;
  }

  changeOrderStatusEvent() {
    if (!this.order.id) return;
    this.changeOrderStatus.emit({orderId: this.order.id, status: OrderStatus.CANCELLED});
  }
}
