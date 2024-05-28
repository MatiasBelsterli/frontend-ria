import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/products/product.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.scss'
})
export class ProductCreateComponent {

  productForm: FormGroup;
  formSubmitted: boolean = false;
  isLoading: boolean = false;

  nameProduct = '';

  constructor(fb: FormBuilder, private productService: ProductService) {
    this.productForm = fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      desc: ['', Validators.required],
    });
  }


  onSubmit() {
    this.formSubmitted = true;
    this.isLoading = true;
    if (this.productForm.valid) {
      this.productService.createProduct(this.productForm.value).subscribe((res) => {
        console.log('Product created:', res);
        this.isLoading = false;
        this.nameProduct = this.productForm.get('name')!.value;
        document.querySelector('.notification')?.classList.remove('is-hidden');
        this.productForm.reset();
      });
    } else {
      console.log('Form is invalid');
    }

  }

  deleteNotification(e: any) {
    this.formSubmitted = false;
    e.target.parentElement.classList.add('is-hidden');
  }

}
