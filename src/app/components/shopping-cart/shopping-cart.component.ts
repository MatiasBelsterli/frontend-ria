import { Component, input } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { Product } from '../../models/products/product.model';
import { OrderService } from '../../services/orders/order.service';
import { toast } from 'bulma-toast'

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent {
  cartProducts: { product: Product, quantity: number }[] = [];
  requireUpdate: boolean = false;
  updateValues: { id: number, quantity: number }[] = [];

  constructor(private cartService: CartService, private orderService: OrderService) {
    this.cartProducts = cartService.getCart();
  }

  updateQuantity({ id, quantity }: { id: number, quantity: number }) {
    const findValue = this.updateValues.find((v) => v.id === id)
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
      this.cartService.updateQuantity(id, quantity);
    });
    this.cartProducts = this.cartService.getCart();
    this.updateValues = [];
    this.requireUpdate = false;
  }

  orderProducts() {
    const productCart = this.cartService.getCart().map(({ product, quantity }) => ({ productId: product.id, quantity }));
    this.orderService.createOrder(productCart).subscribe({
      next: (order) => {
        this.cartService.clearCart();
        this.cartProducts = [];
        toast({
          message: 'Order created successfully!      ',
          type: 'is-success',
          dismissible: true,
          position: 'top-center',
          duration: 4000,
        })
      },
      error: (error) => {
        console.error('Error creating order', error.message);
      }
    })
  }
}