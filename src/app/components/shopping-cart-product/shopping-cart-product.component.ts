import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Product } from '../../models/products/product.model';

@Component({
  selector: 'app-shopping-cart-product',
  templateUrl: './shopping-cart-product.component.html',
  styleUrl: './shopping-cart-product.component.scss'
})
export class ShoppingCartProductComponent implements OnInit{
  @Input({ required: true }) product!: Product;
  @Input({ required: true }) initialQuantity!: number;
  @Output() newerQuantity = new EventEmitter<{ id: number, quantity: number | null }>;
  @Output() deleted = new EventEmitter<{ id: number, quantity: number | null }>;
  urlImage: string = 'https://via.placeholder.com/128x128.png?text=Image'

  quantity: number = 0;

  ngOnInit() {
    this.quantity = this.initialQuantity;
    if (this.product.image !== null) this.urlImage = `data:image/png;base64,${this.product.image}`;
  }

  emitNewQuantity() {
    if (this.quantity < 0) this.quantity = 0;
    if (this.initialQuantity === this.quantity) {
      this.newerQuantity.emit({ id: this.product.id, quantity: null })
    } else {
      this.newerQuantity.emit({ id: this.product.id, quantity: this.quantity });
    }
  }

  increaseQuantity() {
    this.quantity++;
    this.emitNewQuantity();
  }

  decreaseQuantity() {
    if (this.quantity > 0) this.quantity--;
    this.emitNewQuantity();
  }

  deleteProduct() {
    this.quantity = 0;
    this.deleted.emit({ id: this.product.id, quantity: 0 });
  }
}
