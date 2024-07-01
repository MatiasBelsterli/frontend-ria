import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/products/product.service';
import { SuppliesService } from '../../services/supplies/supplies.service';
import { Supply } from '../../models/supplies/supply.model';
import { fileValidator } from "../../validators/file-validator";
import { noDuplicateSupplies } from "../../validators/supplies-validator";

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit {

  productForm: FormGroup;
  formSubmitted: boolean = false;
  isLoading: boolean = false;
  isEditMode: boolean = false;
  productId: string | null = null;
  productName = '';
  supplies: Supply[] = [];
  hasDuplicateSupplies: boolean = false;
  fileLabel: string = 'Choose a file…';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private suppliesService: SuppliesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+(\.[0-9]{1,3})?$')]],
      description: ['', Validators.required],
      image: ['', fileValidator(['image/jpeg', 'image/png'], 2 * 1024 * 1024)],
      supplies: this.fb.array([], noDuplicateSupplies())
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

    this.loadSupplies();
  }

  loadSupplies() {
    this.suppliesService.getSupplies(1, 100).subscribe((data: any) => {
      this.supplies = data.supplies;
    });
  }

  loadProductData() {
    this.productService.getProductById(Number(this.productId)).subscribe(product => {
      this.productForm.patchValue({
        name: product.name,
        price: product.price,
        description: product.description,
      });
      const suppliesFormArray = this.productForm.get('supplies') as FormArray;
      product.supplies.forEach(supply => {
        suppliesFormArray.push(this.createSupplyFormGroup(supply.supplyId, supply.quantity));
      });
    });
  }

  createSupplyFormGroup(supplyId: number | null, quantity: number | null): FormGroup {
    return this.fb.group({
      supplyId: [supplyId, Validators.required],
      quantity: [quantity, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]]
    });
  }

  addSupply() {
    const suppliesFormArray = this.productForm.get('supplies') as FormArray;
    const newSupplyFormGroup = this.createSupplyFormGroup(null, null);
    newSupplyFormGroup.markAllAsTouched();
    suppliesFormArray.push(newSupplyFormGroup);
  }

  removeSupply(index: number) {
    const suppliesFormArray = this.productForm.get('supplies') as FormArray;
    suppliesFormArray.removeAt(index);
  }

  validImage(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.productForm.patchValue({ image: file });
      this.productForm.get('image')!.updateValueAndValidity();
      this.fileLabel = 'Choose another image';
    }
  }

  validateSupplies(): boolean {
    const suppliesFormArray = this.productForm.get('supplies') as FormArray;
    for (let i = 0; i < suppliesFormArray.length; i++) {
      const supplyFormGroup = suppliesFormArray.at(i) as FormGroup;
      if (supplyFormGroup.invalid) {
        supplyFormGroup.markAllAsTouched();
        return false;
      }
    }
    this.hasDuplicateSupplies = this.productForm.get('supplies')?.hasError('duplicateSupplies') ?? false;
    return !this.hasDuplicateSupplies;
  }

  clearSuppliesFormArray() {
    const suppliesFormArray = this.productForm.get('supplies') as FormArray;
    while (suppliesFormArray.length) {
      suppliesFormArray.removeAt(0);
    }
  }

  onSubmit() {
    this.formSubmitted = true;
    this.isLoading = true;
    if (this.productForm.valid && this.validateSupplies()) {
      const formData = new FormData();
      Object.keys(this.productForm.controls).forEach(key => {
        if (key !== 'supplies') {
          formData.append(key, this.productForm.get(key)!.value);
        }
      });
      formData.append('supplies', JSON.stringify(this.productForm.get('supplies')!.value));

      if (this.isEditMode) {
        this.productService.updateProduct(Number(this.productId), formData).subscribe(() => {
          this.isLoading = false;
          this.router.navigate(['/products']);
          this.clearSuppliesFormArray();
        });
      } else {
        this.productService.createProduct(formData).subscribe(() => {
          this.isLoading = false;
          this.formSubmitted = false;
          this.productName = this.productForm.get('name')!.value;
          document.querySelector('.notification')?.classList.remove('is-hidden');
          this.productForm.reset();
          this.clearSuppliesFormArray();
          this.fileLabel = 'Choose a file…';
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

  get suppliesFormArray() {
    return this.productForm.get('supplies') as FormArray;
  }
}
