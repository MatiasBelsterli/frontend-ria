import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Order } from "../../models/orders/order.model";
import { OrderStatus } from "../../enums/order-status";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:3000/orders';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) { }

  getOrdersByUser() {
    return this.http.get<Order[]>(this.apiUrl)
  }

  changeOrderStatus(orderId: number, status: OrderStatus): Observable<Order> {
    const url = `${this.apiUrl}/${orderId}/status`;
    return this.http.patch<Order>(url, { status });
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  createOrder(productCart: { productId: number, quantity: number }[]): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, { products: productCart });
  }
}
