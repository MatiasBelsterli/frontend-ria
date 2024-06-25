import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OrderService } from '../../../services/orders/order.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.scss']
})
export class AdminViewComponent implements OnInit {
  orderList$: Observable<any> = of({ orders: [], totalPages: 0 });
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

  constructor(private orderService: OrderService) { }

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
        return of({ orders: [], totalPages: 0 });
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
}
