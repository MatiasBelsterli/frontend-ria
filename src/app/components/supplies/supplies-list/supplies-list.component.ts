import { Component, OnInit } from '@angular/core';
import { Supply } from "../../../models/supplies/supply.model";
import { SuppliesService } from "../../../services/supplies/supplies.service";

@Component({
  selector: 'app-supplies-list',
  templateUrl: './supplies-list.component.html',
  styleUrls: ['./supplies-list.component.scss']
})
export class SuppliesListComponent implements OnInit {
  supplies: Supply[] = [];
  selectedSupply: Supply | null = null;
  isEditMode = false;
  isLoading = false;
  supplyName = '';
  showNotification = false;
  isModalActive = false;

  constructor(private suppliesService: SuppliesService) {}

  ngOnInit(): void {
    this.loadSupplies();
  }

  loadSupplies(): void {
    this.suppliesService.getSupplies().subscribe((data: Supply[]) => {
      this.supplies = data;
    });
  }

  openModal(editMode: boolean, supply?: Supply): void {
    this.isEditMode = editMode;
    this.isModalActive = true;
    if (editMode && supply) {
      this.selectedSupply = supply;
      this.supplyName = supply.name;
    } else {
      this.selectedSupply = null;
      this.supplyName = '';
    }
  }

  closeModal(): void {
    this.isModalActive = false;
  }

  deleteSupply(id: number): void {
    this.suppliesService.deleteSupply(id).subscribe(() => {
      this.loadSupplies();
    });
  }

  handleFormSubmit(supply: Supply): void {
    this.isLoading = true;
    if (this.isEditMode && this.selectedSupply) {
      this.suppliesService.updateSupply(this.selectedSupply.id!, supply).subscribe(() => {
        this.isLoading = false;
        this.isEditMode = false;
        this.selectedSupply = null;
        this.supplyName = supply.name;
        this.loadSupplies();
        this.showNotification = true;
        this.isModalActive = false;
      });
    } else {
      this.suppliesService.createSupply(supply).subscribe(() => {
        this.isLoading = false;
        this.supplyName = supply.name;
        this.loadSupplies();
        this.showNotification = true;
        this.isModalActive = false;
      });
    }
  }

  deleteNotification(): void {
    this.showNotification = false;
  }
}
