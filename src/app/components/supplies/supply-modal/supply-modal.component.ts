import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Supply, Unit } from '../../../models/supplies/supply.model';

@Component({
  selector: 'app-supply-modal',
  templateUrl: './supply-modal.component.html',
  styleUrls: ['./supply-modal.component.scss']
})
export class SupplyModalComponent implements OnChanges {
  @Input() isEditMode: boolean = false;
  @Input() isModalActive: boolean = false;
  @Input() supply: Supply | null = null;
  @Input() isLoading: boolean = false;
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() submitFormEvent = new EventEmitter<Supply>();

  supplyForm: FormGroup;
  formSubmitted = false;
  units = Object.values(Unit);

  constructor(private fb: FormBuilder) {
    this.supplyForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.0001)]],
      unit: [null, Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isModalActive'] && this.isModalActive) {
      this.initializeForm();
    }
  }

  initializeForm(): void {
    if (this.isEditMode && this.supply) {
      this.supplyForm.patchValue(this.supply);
    } else {
      this.supplyForm.reset();
    }
  }

  closeModal(): void {
    this.closeModalEvent.emit();
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.supplyForm.invalid) {
      return;
    }
    this.submitFormEvent.emit(this.supplyForm.value);
  }
}
