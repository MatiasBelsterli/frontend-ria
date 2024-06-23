import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
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

  getOrdersByUser(page: number, limit: number, filters: any) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    Object.keys(filters).forEach(key => {
      if (filters[key]) params = params.set(key, filters[key]);
    });
    return this.http.get<Order[]>(this.apiUrl, { params })
  }

  changeOrderStatus(orderId: number, status: OrderStatus): Observable<Order> {
    const url = `${this.apiUrl}/${orderId}/status`;
    return this.http.patch<Order>(url, { status });
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  createOrder(products: Product[], deliveryDate: Date): Observable<Order> {
    const productCart: { productId: number, quantity: number }[] = products.map(product => ({
      productId: product.id,
      quantity: product.quantity ?? 1
    }));

    return this.http.post<Order>(this.apiUrl, { products: productCart , deliveryDate});
  }

  getOrdersToBakers(page: number, limit: number, filters: any) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    Object.keys(filters).forEach(key => {
      if (filters[key]) params = params.set(key, filters[key]);
    });
    return this.http.get<Order[]>(`${this.apiUrl}/bakers`, { params });
  }

  takeOrderToBaker(orderId: number) {
    return this.http.patch<Order>(`${this.apiUrl}/bakers/${orderId}`, {});
  }

  getOrdersByBaker() {
    return this.http.get<Order[]>(`${this.apiUrl}/baker`);
  }

  completeOrderByBaker(orderId: number) {
    return this.http.patch<Order>(`${this.apiUrl}/bakers/${orderId}`, { status: OrderStatus.COMPLETED });
  }

}
