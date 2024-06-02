import { Injectable } from '@angular/core';
import { Product } from '../../models/products/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartKey = 'cart';

  constructor() { }

  add(product: Product, quantity: number) {
    const cart = this.getCart();
    const existingProduct = cart.find(item => item.product.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }
    this.saveCart(cart);
  }

  remove(productId: number) {
    let cart = this.getCart();
    cart = cart.filter(item => item.product.id !== productId);
    this.saveCart(cart);
  }

  updateQuantity(productId: number, quantity: number) {
    const cart = this.getCart();
    const existingProduct = cart.find(item => item.product.id === productId);

    if (existingProduct) {
      existingProduct.quantity = quantity;
      if (quantity === 0) {
        return this.remove(productId);
      }
    }

    this.saveCart(cart);
  }

  getCart(): { product: Product, quantity: number }[] {
    const cart = localStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : [];
  }

  clearCart() {
    localStorage.removeItem(this.cartKey);
  }

  private saveCart(cart: { product: Product, quantity: number }[]) {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
  }
}
