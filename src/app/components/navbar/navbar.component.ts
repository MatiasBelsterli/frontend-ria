import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private theme: string = 'dark';

  public isLogged: boolean = localStorage.getItem('token') ? true : false;

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  getCurrentTheme() {
    return this.theme;
  }

  logout() {
    localStorage.removeItem('token');
    this.isLogged = false;
  }
}
