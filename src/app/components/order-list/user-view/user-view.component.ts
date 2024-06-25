import {Component, OnInit} from '@angular/core';
import {OrderService} from '../../../services/orders/order.service';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {OrderStatus} from "../../../enums/order-status";
import {toast} from "bulma-toast";

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {
  orderList$: Observable<any> = of({orders: [], totalPages: 0});
  hasError: boolean = false;
  totalPages: number = 0;
  currentPage = 1;
  limit = 8;
  filters: any = {
    sortRequestDate: '',
    sortDeliveryDate: '',
    sortPrice: '',
    status: '',
    rangeFrom: null,
    rangeTo: null,
  };
  rangeDateFilter: { from: Date | null, to: Date | null } = { from: null, to: null }
  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  onSort(filterType: string, value: any) {
    this.filters.sortRequestDate = '';
    this.filters.sortDeliveryDate = '';
    this.filters.sortPrice = '';
    if (filterType === 'rangeDate') {
      this.filters.rangeFrom = value.target.value.from;
      this.filters.rangeTo = value.target.value.to
    } else {
      this.filters[filterType] = value.target.value;
    }
    this.loadOrders();
  }

  loadOrders() {
    this.orderList$ = this.orderService.getOrdersByUser(this.currentPage, this.limit, this.filters).pipe(
      catchError(err => {
        console.error('Error getting orders', err);
        this.hasError = true;
        return of({orders: [], totalPages: 0});
      })
    );
    this.orderList$.subscribe(data => {
      this.totalPages = data.totalPages;
    });
  }

  onPageChange(page: number) {
    if (page === this.currentPage) return;
    this.currentPage = page;
    this.loadOrders();
  }

  changeOrderStatus(event: { orderId: number, status: OrderStatus }) {
    this.orderService.changeOrderStatus(event.orderId, event.status).subscribe({
      next: () => {
        toast({
          message: 'Order canceled successfully!',
          type: 'is-success',
          position: 'top-center',
          duration: 3000,
          dismissible: true,
        });
        this.loadOrders();
      },
      error: (err) => {
        toast({
          message: 'Error changing order status',
          type: 'is-danger',
          position: 'top-center',
          duration: 3000,
          dismissible: true,
        });
        console.error('Error changing order status', err);
      }
    });
  }
}
