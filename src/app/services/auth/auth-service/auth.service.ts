import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { UserRole } from '../../../enums/user-role';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private userType = new BehaviorSubject<string>(localStorage.getItem('role') as UserRole);
  private apiUrl = 'http://localhost:3000/users';
  constructor(private router: Router, private http: HttpClient) { }

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get isUserType(): Observable<string> {
    return this.userType.asObservable();
  }

  private hasToken(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  register(user: any): Observable<any> {
    user.append('role', UserRole.USER);
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      catchError(this.handleError)
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('userId', response.userId);
        this.loggedIn.next(true);
        this.userType.next(response.role);
      }),
      catchError(this.handleError)
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.loggedIn.next(false);
    this.userType.next("");
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

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(error);
  }
}
