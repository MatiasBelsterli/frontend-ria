import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "../../services/auth/auth-service/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router, fb: FormBuilder) {
    this.loginForm = fb.group({
      email: ['admin@example.com', Validators.required],
      password: ['admin123', Validators.required]
    });
  }

  login(): void {
    const credentials = this.loginForm.value;
    this.authService.login(credentials).subscribe(
      response => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/']);
      },
      error => {
        this.errorMessage = 'Invalid email or password';
      }
    );
  }


  // TODO delete
  log(credentials: any): void {
    this.authService.login(credentials).subscribe(
      response => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/']);
      },
      error => {
        this.errorMessage = 'Invalid email or password';
      }
    );
  }
  logBaker() {
    this.log({email: 'baker@example.com', password: 'baker123'})
  }
  logUser1() {
    this.log({email: 'user@example.com', password: 'user123'})
  }
  logUser2() {
    this.log({email: 'user2@example.com', password: 'user123'})
  }
}
