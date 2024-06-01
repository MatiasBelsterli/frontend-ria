import { Component, Input } from '@angular/core';
import { Product } from '../../models/products/product.model';
import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  constructor(private cartService: CartService) { }

  @Input({ required: true }) product!: Product;
  quantity: number = 0;

  addToCart() {
    if (this.quantity < 1) return;
    this.cartService.add(this.product, this.quantity);
    this.quantity = 0
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 0) this.quantity--;
  }
}
