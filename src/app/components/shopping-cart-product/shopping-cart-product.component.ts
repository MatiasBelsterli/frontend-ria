import { Component, Input } from '@angular/core';
import { Product } from '../../models/products/product.model';
import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-shopping-cart-product',
  templateUrl: './shopping-cart-product.component.html',
  styleUrl: './shopping-cart-product.component.scss'
})
export class ShoppingCartProductComponent {
  @Input({ required: true }) product!: Product;
  @Input({ required: true }) initialQuantity!: number;
  quantity: number = 0;

  constructor(private cartService: CartService) { }
  ngOnInit() {
    this.quantity = this.initialQuantity;
  }


  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 0) this.quantity--;
  }

  updateQuantity() {
    if (this.quantity < 0) this.quantity = 0;
    if (this.initialQuantity === this.quantity) return;
    this.cartService.updateQuantity(this.product.id, this.quantity);
    this.initialQuantity = this.quantity;
  }
}
