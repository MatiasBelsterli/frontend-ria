import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  formSubmitted = false;

  constructor(private fb: FormBuilder,) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(9), Validators.maxLength(9)]],
    });
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
    } else {
      console.log('Form is invalid');
    }
  }
}
