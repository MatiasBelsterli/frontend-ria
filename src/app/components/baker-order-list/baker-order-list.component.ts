import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { OrderService } from '../../services/orders/order.service';
import { catchError, Observable, of } from 'rxjs';
import { OrderStatus } from '../../enums/order-status';
import { toast } from "bulma-toast";
import { OrderComponent } from "../order-list/order/order.component";
import {ProductSupply} from "../../models/products/product.model";
import {Order} from "../../models/orders/order.model";

@Component({
  selector: 'app-baker-order-list',
  templateUrl: './baker-order-list.component.html',
  styleUrl: './baker-order-list.component.scss'
})
export class BakerOrderListComponent implements OnInit {
  orderList$: Observable<any> = of( {orders: [], totalPages: 0});
  @ViewChildren(OrderComponent) orderComponents!: QueryList<OrderComponent>;
  hasError: boolean = false;
  totalPages: number = 0;
  currentPage = 1;
  isModalActive = false;
  supplies: ProductSupply[] = []
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
    this.orderList$ = this.orderService.getOrdersByBaker(this.currentPage, this.limit, this.filters).pipe(
      catchError(err => {
        console.error('Error getting orders', err);
        this.hasError = true;
        return of([]);
      })
    )
    this.orderList$.subscribe(data => {
      this.totalPages = data.totalPages;
      this.supplies = []
      data.orders.forEach((order: Order) => {
        order.products.forEach(product => {
          product.supplies.forEach(supply => {
            let supplyEntry = this.supplies.find(entry => entry.supplyId === supply.supplyId);
            if (!supplyEntry) {
              supplyEntry = { supplyId: supply.supplyId, quantity: 0 };
              this.supplies.push(supplyEntry);
            }
            supplyEntry.quantity += supply.quantity * (product.quantity ?? 0);
          });
        });
      });
    });
  }

  completeOrder(event: { orderId: number, status: OrderStatus }) {
    const orderId = event.orderId;
    this.orderService.completeOrderByBaker(orderId).subscribe({
      next: updatedOrder => {
        const modifiedOrder = this.orderComponents.find(order => order.order.id === orderId);
        if (modifiedOrder) {
          modifiedOrder.order.status = updatedOrder.status;
        }
        toast({
          message: 'Marked as completed correctly!      ',
          type: 'is-success',
          position: 'top-center',
          duration: 3000,
          dismissible: true,
        })
      },
      error: () => {
        toast({
          message: 'Error updating order status      ',
          type: 'is-danger',
          position: 'top-center',
          duration: 3000,
          dismissible: true,
        })
      }
    });
  }
  onPageChange(page: number) {
    if (page === this.currentPage) return
    this.currentPage = page;
    this.loadOrders();
  }
  clearFilter() {
    this.filters = {
      sortRequestDate: '',
      sortDeliveryDate: '',
      sortPrice: '',
      status: '',
      rangeFrom: null,
      rangeTo: null,
    };
    this.rangeDateFilter = { from: null, to: null }
    this.loadOrders();
  }

  toggleModal(to: boolean): void {
    this.isModalActive = to;
  }
}
