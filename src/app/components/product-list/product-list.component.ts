import {Component, OnInit} from '@angular/core';
import { ProductService } from '../../services/products/product.service';
import { Observable, catchError } from 'rxjs';
import { Product } from '../../models/products/product.model';
import {AuthService} from "../../services/auth/auth-service/auth.service";
import { UserRole } from "../../enums/user-role";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  public productList$: Observable<Product[]>;
  public hasError: boolean = false;
  userType: String = '';

  ngOnInit() {
    this.authService.isUserType.subscribe(userType => {
      this.userType = userType;
    });
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: value => {
        document.querySelector(`#product_${id}`)?.remove()
      }, error: err => {
        console.error(err)
      }
    })
  }

  constructor(private productService: ProductService, private authService: AuthService) {
    this.productList$ = this.productService.getProducts().pipe(catchError(err => {
      console.error('Error getting products', err);
      this.hasError = true;
      // throw new Error(err);
      return [];
    }));
  }

  protected readonly UserRole = UserRole;
}
