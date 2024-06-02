import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../models/products/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:3000/cart';

  constructor(private http: HttpClient) { }

  add(product: Product, quantity: number): Observable<any> {
    return this.http.post(this.apiUrl, { productId: product.id, quantity });
  }

  remove(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${productId}`);
  }

  updateQuantity(productId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${productId}`, { quantity });
  }

  getCart(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  clearCart(): Observable<any> {
    return this.http.delete(this.apiUrl);
  }
}

