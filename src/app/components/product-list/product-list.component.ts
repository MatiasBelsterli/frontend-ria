import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/products/product.service';
import { Observable, catchError, of } from 'rxjs';
import { AuthService } from "../../services/auth/auth-service/auth.service";
import { UserRole } from "../../enums/user-role";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  productList$: Observable<any> = of({ products: [], totalPages: 0 });
  public hasError: boolean = false;
  userType: String = '';

  searchTerm = new FormControl('');

  totalPages: number = 0;
  currentPage = 1;
  limit = 8;

  ngOnInit() {
    this.authService.isUserType.subscribe(userType => {
      this.userType = userType;
    });
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        document.querySelector(`#product_${id}`)?.remove()
      }, error: err => {
        console.error(err)
      }
    })
  }

  loadProducts() {
    this.productList$ = this.productService.getProducts(this.currentPage, this.limit, this.searchTerm.value ?? '').pipe(
      catchError(err => {
        console.error('Error getting products', err);
        this.hasError = true;
        return of({ products: [], totalPages: 0 });
      })
    );
    this.productList$.subscribe(data => {
      this.totalPages = data.totalPages;
    });
  }
  constructor(private productService: ProductService, private authService: AuthService) {
    this.loadProducts();
  }

  onPageChange(page: number) {
    if (page === this.currentPage) return
    this.currentPage = page;
    this.loadProducts();
  }

  protected readonly UserRole = UserRole;
}
