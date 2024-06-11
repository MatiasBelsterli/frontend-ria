import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/products/product.service';
import { fileValidator } from "../../validators/file-validator";

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.scss'
})
export class ProductCreateComponent implements OnInit {

  productForm: FormGroup;
  formSubmitted: boolean = false;
  isLoading: boolean = false;
  isEditMode: boolean = false;
  productId: string | null = null;
  productName = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      description: ['', Validators.required],
      image: ['', fileValidator(['image/jpeg', 'image/png'], 2 * 1024 * 1024)]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      this.isEditMode = !!this.productId;
      if (this.isEditMode) {
        this.productForm.get('image')?.clearValidators();
        this.loadProductData();
      } else {
        this.productForm.get('image')?.setValidators([Validators.required, fileValidator(['image/jpeg', 'image/png'], 2 * 1024 * 1024)]);
      }
      this.productForm.get('image')?.updateValueAndValidity();
    });
  }

  loadProductData() {
    this.productService.getProductById(Number(this.productId)).subscribe(product => {
      this.productForm.patchValue({
        name: product.name,
        price: product.price,
        description: product.description,
        // We do not load the image, since we cannot preview it
      });
    });
  }

  validImage(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.productForm.patchValue({ image: file });
      this.productForm.get('image')!.updateValueAndValidity();
    }
  }

  onSubmit() {
    this.formSubmitted = true;
    this.isLoading = true;
    if (this.productForm.valid) {
      if (this.isEditMode) {
        this.productService.updateProduct(Number(this.productId), this.productForm.value).subscribe(() => {
          this.isLoading = false;
          this.router.navigate(['/products']);
        });
      } else {
        this.productService.createProduct(this.productForm.value).subscribe(() => {
          this.isLoading = false;
          this.formSubmitted = false;
          this.productName = this.productForm.get('name')!.value;
          document.querySelector('.notification')?.classList.remove('is-hidden');
          this.productForm.reset();
        });
      }
    } else {
      this.isLoading = false;
    }
  }

  deleteNotification(e: any) {
    this.formSubmitted = false;
    e.target.parentElement.classList.add('is-hidden');
  }
}
