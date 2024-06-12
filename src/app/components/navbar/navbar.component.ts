import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth/auth-service/auth.service";
import { UserRole } from "../../enums/user-role";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public isLogged: boolean = false;
  private theme: string = 'dark';
  public userType: string = '';

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.checkTokenValidity();
    this.authService.isLoggedIn.subscribe(loggedIn => {
      this.isLogged = loggedIn;
    });
    this.authService.isUserType.subscribe(userType => {
      this.userType = userType;
    });
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  getCurrentTheme() {
    return this.theme;
  }

  logout() {
    this.authService.logout();
  }

  protected readonly UserRole = UserRole;
}
