import { Component } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { Product } from '../../models/products/product.model';
import { OrderService } from '../../services/orders/order.service';
import { toast } from 'bulma-toast';
import { catchError, Observable, of } from "rxjs";

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent {
  cartProducts$!: Observable<Product[]>;
  requireUpdate: boolean = false;
  updateValues: { id: number, quantity: number }[] = [];
  hasError: boolean = false;
  deliveryDate: Date | null = null
  totalPrice: number = 0

  constructor(private cartService: CartService, private orderService: OrderService) {
    this.loadCart()
  }



  loadCart() {
    this.cartProducts$ = this.cartService.getCart().pipe(catchError(err => {
      console.error('Error getting products', err);
      this.hasError = true;
      return [];
    }));
    this.cartProducts$.subscribe(products => {
      this.totalPrice = products.reduce((sum, product) => sum + product.price * (product.quantity ?? 0), 0);
    });
  }

  updateQuantity({ id, quantity }: { id: number, quantity: number | null }) {
    const findValue = this.updateValues.find((v) => v.id === id);
    if (findValue) {
      if (quantity !== null ) findValue.quantity = quantity;
      if (quantity === null) this.updateValues = this.updateValues.filter((v) => v.id !== id);
    } else {
      if (quantity !== null) this.updateValues.push({ id, quantity });
    }
    this.requireUpdate = this.updateValues.length !== 0;
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
    if (this.deliveryDate === null) {
      return toast({
        message: 'Please select a delivery date.',
        type: "is-danger",
        dismissible: true,
        position: 'top-center',
        duration: 4000,
      });
    }
    const dateToSend: Date = this.deliveryDate
    this.cartProducts$.subscribe((productCart) => {
      this.orderService.createOrder(productCart, dateToSend).subscribe({
        next: (order) => {
          this.cartService.clearCart().subscribe(() => {
            toast({
              message: 'Order created successfully!',
              type: 'is-success',
              dismissible: true,
              position: 'top-center',
              duration: 4000,
            });
            this.cartProducts$ = of([]);
          });
        },
        error: (error) => {
          console.error('Error creating order', error.message);
        }
      });
    });
  }

}
