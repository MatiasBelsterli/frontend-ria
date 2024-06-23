import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Supply } from "../../models/supplies/supply.model";

@Injectable({
  providedIn: 'root'
})
export class SuppliesService {
  private apiUrl = `http://localhost:3000/supplies`;

  constructor(private http: HttpClient) { }

  getSupplies(page: number, limit: number, searchTerm: string = ''): Observable<Supply[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }
    return this.http.get<Supply[]>(this.apiUrl, { params });
  }

  getSupplyById(id: number): Observable<Supply> {
    return this.http.get<Supply>(`${this.apiUrl}/${id}`);
  }

  createSupply(supply: Supply): Observable<Supply> {
    return this.http.post<Supply>(this.apiUrl, supply);
  }

  updateSupply(id: number, supply: Supply): Observable<Supply> {
    return this.http.put<Supply>(`${this.apiUrl}/${id}`, supply);
  }

  deleteSupply(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
