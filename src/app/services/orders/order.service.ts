import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Order } from "../../models/orders/order.model";
import { OrderStatus } from "../../enums/order-status";
import { Product } from "../../models/products/product.model";

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

  createOrder(products: Product[]): Observable<Order> {
    const productCart: { productId: number, quantity: number }[] = products.map(product => ({
      productId: product.id,
      quantity: product.quantity ?? 1
    }));

    return this.http.post<Order>(this.apiUrl, { products: productCart });
  }
}
