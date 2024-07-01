import { Component, OnInit } from '@angular/core';
import { Supply } from "../../../models/supplies/supply.model";
import { SuppliesService } from "../../../services/supplies/supplies.service";
import { FormControl } from "@angular/forms";
import {toast} from "bulma-toast";

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
  searchTerm = new FormControl('');

  totalPages: number = 0;
  currentPage = 1;
  limit = 10;

  constructor(private suppliesService: SuppliesService) {}

  ngOnInit(): void {
    this.loadSupplies();
  }

  loadSupplies(): void {
    this.suppliesService.getSupplies(this.currentPage, this.limit, this.searchTerm.value ?? '').subscribe((data: any) => {
      this.supplies = data.supplies;
      this.totalPages = data.totalPages
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
    this.suppliesService.deleteSupply(id).subscribe({
      next: () => {
        toast({
          message: 'Supply deleted successfully!      ',
          type: 'is-success',
          position: 'top-center',
          duration: 3000,
          dismissible: true,
        })
        this.loadSupplies();
      },
      error: err => {
        toast({
          message: 'Error to delete supply      ',
          type: 'is-danger',
          position: 'top-center',
          duration: 3000,
          dismissible: true,
        })
      }
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

  onPageChange(page: number) {
    if (page === this.currentPage) return
    this.currentPage = page;
    this.loadSupplies();
  }

  deleteNotification(): void {
    this.showNotification = false;
  }
}
