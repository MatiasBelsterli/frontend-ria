import { Component } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent {
  constructor(cartService: CartService) {
    console.log('ShoppingCartComponent');
    console.log(cartService.getCart());
  }

}
