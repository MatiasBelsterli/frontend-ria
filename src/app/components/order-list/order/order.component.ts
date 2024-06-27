import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OrderStatus } from "../../../enums/order-status";
import { Order } from "../../../models/orders/order.model";
import { AuthService } from "../../../services/auth/auth-service/auth.service";
import { UserRole } from "../../../enums/user-role";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  @Input({required:true}) order!: Order;
  @Input() options: boolean = false;
  @Input() toBaker: boolean = false;
  @Output() changeOrderStatus = new EventEmitter<{ orderId: number, status: OrderStatus }>();
  userType: String = '';
  textButton: string = 'Options'

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isUserType.subscribe(userType => {
      this.userType = userType;
    });
    switch (this.userType) {
      case UserRole.USER:
        this.textButton = this.order.status === 'CANCELLED' ? 'Cancelled' : 'Cancel'
        break;
      case UserRole.BAKER:
        if (this.toBaker)
          this.textButton = this.order.status === 'COMPLETED' ? 'Completed' : 'Complete'
        else
          this.textButton = 'Take'
        break;
    }
  }
  visibleOrderDetails: boolean = false;

  toggleOrderDetails() {
    this.visibleOrderDetails = !this.visibleOrderDetails;
  }

  changeOrderStatusEvent() {
    if (!this.order.id) return;
    this.changeOrderStatus.emit({orderId: this.order.id, status: OrderStatus.CANCELLED});
  }

  protected readonly UserRole = UserRole;
}
