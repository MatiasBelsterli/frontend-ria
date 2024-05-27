import { Component } from '@angular/core';
import { ProductService } from '../../services/products/product.service';
import { Observable, catchError } from 'rxjs';
import { Product } from '../../models/products/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  public productList$: Observable<Product[]>;
  public hasError: boolean = false;
  constructor(private productService: ProductService) {
    this.productList$ = this.productService.getProducts().pipe(catchError(err => {
      console.error('Error getting products', err);
      this.hasError = true;
      // throw new Error(err);
      return [];
    }));
  }
}
