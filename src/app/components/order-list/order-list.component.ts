import {Component} from '@angular/core';
import {UserRole} from '../../enums/user-role';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent {
  isUser: boolean;
  isBaker: boolean;
  isAdmin: boolean;
  constructor() {
    const role = localStorage.getItem('role') as UserRole;
    this.isUser = role === UserRole.USER;
    this.isBaker = role === UserRole.BAKER;
    this.isAdmin = role === UserRole.ADMIN;
  }
}
