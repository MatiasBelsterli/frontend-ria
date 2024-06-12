import { Component } from '@angular/core';
import { UserService } from '../../services/users/user.service';
import { AuthService } from "../../services/auth/auth-service/auth.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  constructor(private userService: UserService, private authService: AuthService) { }

  registerUser(user: any): void {
    this.authService.register(user).subscribe(response => {
      console.log('User registered:', response);
    });
  }

  loginUser(credentials: any): void {
    this.authService.login(credentials).subscribe(response => {
      console.log('User logged in:', response);
      localStorage.setItem('token', response.token);
    });
  }

  changeUserPassword(data: any): void {
    this.userService.changePassword(data).subscribe(response => {
      console.log('Password changed:', response);
    });
  }

  forgotUserPassword(email: string): void {
    this.userService.forgotPassword(email).subscribe(response => {
      console.log('Password reset link sent:', response);
    });
  }

  enableUser(id: number): void {
    this.userService.enableUser(id).subscribe(response => {
      console.log('User enabled:', response);
    });
  }

  disableUser(id: number): void {
    this.userService.disableUser(id).subscribe(response => {
      console.log('User disabled:', response);
    });
  }
}
