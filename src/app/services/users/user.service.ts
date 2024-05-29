import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/usuarios'; // URL del backend
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) { }

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      catchError(this.handleError)
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        this.loggedIn.next(true);
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
  }

  changePassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, data).pipe(
      catchError(this.handleError)
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email }).pipe(
      catchError(this.handleError)
    );
  }

  enableUser(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/enable-user`, { id }).pipe(
      catchError(this.handleError)
    );
  }

  disableUser(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/disable-user`, { id }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(error);
  }
}
