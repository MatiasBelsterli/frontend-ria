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

  constructor(private cartService: CartService, private orderService: OrderService) {
    this.cartProducts = cartService.getCart();
  }

  orderProducts() {
    console.log('Ordering products');
    const productCart = this.cartService.getCart().map(({ product, quantity }) => ({ productId: product.id, quantity }));
    this.orderService.createOrder(productCart).subscribe({
      next: (order) => {
        console.log('Order created', order);
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