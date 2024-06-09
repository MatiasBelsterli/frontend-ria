import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/products/product.service';
import { fileValidator } from "../../validators/file-validator";

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.scss'
})
export class ProductCreateComponent {

  productForm: FormGroup;
  formSubmitted: boolean = false;
  isLoading: boolean = false;

  productName = '';

  constructor(fb: FormBuilder, private productService: ProductService) {
    this.productForm = fb.group({
      name: ['a', Validators.required],
      price: ['2', [Validators.required, Validators.pattern('^[0-9]*$')]],
      description: ['b', Validators.required],
      image: ['', [Validators.required, fileValidator(['image/jpeg', 'image/png'], 2 * 1024 * 1024)]],
    });
  }


  validImage(event: any) {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      const file = input.files[0];
      this.productForm.patchValue({
        image: file
      });
      this.productForm.get('image')!.updateValueAndValidity();
    }
  }

  onSubmit() {
    this.formSubmitted = true;
    this.isLoading = true;
    if (this.productForm.valid) {
      this.productService.createProduct(this.productForm.value).subscribe(() => {
        this.isLoading = false;
        this.formSubmitted = false;
        this.productName = this.productForm.get('name')!.value;
        document.querySelector('.notification')?.classList.remove('is-hidden');
        this.productForm.reset();
      });
    } else {
      this.isLoading = false;
    }

  }

  deleteNotification(e: any) {
    this.formSubmitted = false;
    e.target.parentElement.classList.add('is-hidden');
  }

}
