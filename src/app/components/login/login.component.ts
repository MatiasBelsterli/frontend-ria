import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/users/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) { }

  login(): void {
    const credentials = { email: this.email, password: this.password };
    this.userService.login(credentials).subscribe(
      response => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/']); // Redirige a la página principal o a la ruta deseada después del login
      },
      error => {
        this.errorMessage = 'Invalid email or password';
      }
    );
  }
}
