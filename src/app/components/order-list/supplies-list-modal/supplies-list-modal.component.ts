import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductSupply } from "../../../models/products/product.model";
import { SuppliesService } from "../../../services/supplies/supplies.service";
import { Supply } from "../../../models/supplies/supply.model";

@Component({
  selector: 'app-supplies-list-modal',
  templateUrl: './supplies-list-modal.component.html',
  styleUrl: './supplies-list-modal.component.scss'
})
export class SuppliesListModalComponent {
  private _supplies: ProductSupply[] = [];
  public detailedSupplies: (ProductSupply & { details?: Supply })[] = [];

  @Input() isModalActive: boolean = false;

  @Input({ required: true })
  set supplies(value: ProductSupply[]) {
    this._supplies = value;
    this.fetchSuppliesDetails();
  }

  get supplies(): ProductSupply[] {
    return this._supplies;
  }

  @Output() closeModalEvent = new EventEmitter<void>();

  constructor(private suppliesService: SuppliesService) {}

  private fetchSuppliesDetails(): void {
    this.detailedSupplies = this._supplies.map(supply => ({ ...supply }));

    this._supplies.forEach((supply, index) => {
      this.suppliesService.getSupplyById(supply.supplyId).subscribe(details => {
        this.detailedSupplies[index].details = details;
      });
    });
  }

  closeModal(): void {
    this.closeModalEvent.emit();
  }
}
