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
  isModalActive = false;

  constructor(private authService: AuthService, private router: Router, fb: FormBuilder) {
    this.loginForm = fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {
    const credentials = this.loginForm.value;
    this.authService.login(credentials).subscribe(
      response => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/']);
      },
      () => {
        this.errorMessage = 'Invalid email or password';
      }
    );
  }

  forgotPass(evt: Event) {
    evt.preventDefault();
    this.toggleModal(true)
  }

  toggleModal(to: boolean): void {
    this.isModalActive = to;
  }
}
