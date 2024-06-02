import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private router: Router) {}

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  private hasToken(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  login(token: string) {
    localStorage.setItem('token', token);
    this.loggedIn.next(true);
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  checkTokenValidity() {
    const token = localStorage.getItem('token');
    if (token) {
      const isValid = this.validateToken(token);
      this.loggedIn.next(isValid);
      if (!isValid) {
        this.logout();
        alert('Your session has expired. Please log in again.');
      }
    } else {
      this.loggedIn.next(false);
    }
  }

  private validateToken(token: string): boolean {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const expiryDate = new Date(decodedToken.exp * 1000);
      return expiryDate > new Date();
    } catch (e) {
      return false;
    }
  }
}
