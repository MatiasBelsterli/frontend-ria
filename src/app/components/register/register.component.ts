import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  formSubmitted = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(8)]],
      role: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(9), Validators.maxLength(9)]],
    }, {
      validator: this.passwordMatchValidator('password', 'passwordConfirm')
    });
  }

  passwordMatchValidator(password: string, passwordConfirm: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const passwordConfirmControl = formGroup.controls[passwordConfirm];

      if (passwordControl.value !== passwordConfirmControl.value) {
        passwordConfirmControl.setErrors({ passwordMismatch: true });
      } else {
        passwordConfirmControl.setErrors(null);
      }
    }
  }

  onChangeRole(event: any) {
    const selectRoles = event.target;
    const options = selectRoles?.querySelectorAll('option');
    options.forEach((element: HTMLOptionElement) => {
      element.value === "" ? element.disabled = true : element.disabled = false;
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.registerForm.valid) {
      console.log('Form is valid');
      this.authService.register(this.registerForm.value).subscribe({
        next: response => {
          console.log('User registered successfully');
        },
        error: error => {
          console.error('There was an error!', error);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
