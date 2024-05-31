import { Component, Input } from '@angular/core';
import { Product } from '../../models/products/product.model';
import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  constructor(private cartService: CartService) {}
  
  @Input() product?: Product;
  quantity: number = 0;

  addToCart(product: Product, quantity: number) {
    this.cartService.add(product, quantity);
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }
}
