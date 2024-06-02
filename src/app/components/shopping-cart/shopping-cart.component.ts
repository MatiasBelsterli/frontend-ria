import { Component } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { Product } from '../../models/products/product.model';
import { OrderService } from '../../services/orders/order.service';
import { toast } from 'bulma-toast';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent {
  cartProducts: Product[] = [];
  requireUpdate: boolean = false;
  updateValues: { id: number, quantity: number }[] = [];

  constructor(private cartService: CartService, private orderService: OrderService) {
    this.cartService.getCart().subscribe(cart => {
      this.cartProducts = cart;
      console.log('Cart loaded:', this.cartProducts[0]);
    }, error => {
      console.error('Error loading cart', error);
    });
  }

  loadCart() {
    this.cartService.getCart().subscribe(cart => {
      this.cartProducts = cart;
      console.log('Cart loaded:', this.cartProducts);
    }, error => {
      console.error('Error loading cart', error);
    });
  }

  updateQuantity({ id, quantity }: { id: number, quantity: number }) {
    const findValue = this.updateValues.find((v) => v.id === id);
    if (findValue) {
      findValue.quantity = quantity;
      if (quantity === -1) this.updateValues = this.updateValues.filter((v) => v.id !== id);
    } else {
      this.updateValues.push({ id, quantity });
    }
    this.requireUpdate = true;
    if (this.updateValues.length === 0) this.requireUpdate = false;
  }

  updateQuantityCart() {
    this.updateValues.forEach(({ id, quantity }) => {
      this.cartService.updateQuantity(id, quantity).subscribe();
    });
    this.loadCart();
    this.updateValues = [];
    this.requireUpdate = false;
  }

  orderProducts() {
    const productCart = this.cartProducts;
    this.orderService.createOrder(productCart).subscribe({
      next: (order) => {
        this.cartService.clearCart().subscribe();
        this.cartProducts = [];
        toast({
          message: 'Order created successfully!',
          type: 'is-success',
          dismissible: true,
          position: 'top-center',
          duration: 4000,
        });
      },
      error: (error) => {
        console.error('Error creating order', error.message);
      }
    });
  }
}
