import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public isLogged: boolean = false;
  private theme: string = 'dark';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.checkTokenValidity();
    this.authService.isLoggedIn.subscribe(loggedIn => {
      this.isLogged = loggedIn;
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
}
