import { Component, OnInit } from '@angular/core';
import { OrderStatus } from '../../../enums/order-status';
import { OrderService } from '../../../services/orders/order.service';
import { catchError, Observable, of } from 'rxjs';
import { toast } from "bulma-toast";

@Component({
  selector: 'app-baker-view',
  templateUrl: './baker-view.component.html',
  styleUrl: './baker-view.component.scss'
})
export class BakerViewComponent implements OnInit {
  orderList$: Observable<any> = of( {orders: [], totalPages: 0});
  hasError: boolean = false;
  totalPages: number = 0;
  currentPage = 1;
  limit = 8;
  filters: any = {
    sortRequestDate: '',
    sortDeliveryDate: '',
    sortPrice: '',
    rangeFrom: null,
    rangeTo: null,
  };
  rangeDateFilter: { from: Date | null, to: Date | null } = { from: null, to: null }

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
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
    this.orderList$ = this.orderService.getOrdersToBakers(this.currentPage, this.limit, this.filters).pipe(
      catchError(err => {
        console.error('Error getting orders', err);
        this.hasError = true;
        return of([]);
      })
    );
    this.orderList$.subscribe(data => {
      this.totalPages = data.totalPages;
    })
  }

  takeOrder(event: { orderId: number, status: OrderStatus }) {
    const orderId = event.orderId;
    this.orderService.takeOrderToBaker(orderId).subscribe({
      next: () => {
        document.querySelector(`#orders_${orderId}`)?.remove()
        toast({
          message: 'Order taken correctly!      ',
          type: 'is-success',
          position: 'top-center',
          duration: 3000,
          dismissible: true,
        })
      },
      error: error => {
        toast({
          message: 'Error updating order status      ',
          type: 'is-danger',
          position: 'top-center',
          duration: 3000,
          dismissible: true,
        })
        console.error('Error updating order status', error);
      }
    });
  }

  onPageChange(page: number) {
    if (page === this.currentPage) return
    this.currentPage = page;
    this.loadOrders();
  }
}
