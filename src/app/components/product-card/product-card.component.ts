import { Component, Input } from '@angular/core';
import { Product } from '../../models/products/product.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product?: Product;

  addToCart(product: Product) {
    console.log('Product added to cart', this.product);
  }
}
