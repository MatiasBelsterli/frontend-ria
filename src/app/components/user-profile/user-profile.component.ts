import { Component, OnInit } from '@angular/core';
import { UserService } from "../../services/users/user.service";
import { User } from '../../models/users/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: User | undefined;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.getUserById(Number(userId)).subscribe(
        (data: User) => this.user = data,
        (error: any) => console.error('Failed to load user data', error)
      );
    }
  }
}
