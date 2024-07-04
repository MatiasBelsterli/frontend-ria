import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "../../services/auth/auth-service/auth.service";
import { fileValidator } from "../../validators/file-validator";
import {toast} from "bulma-toast";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  formSubmitted = false;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(8)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(9), Validators.maxLength(11)]],
      image: ['', fileValidator(['image/jpeg', 'image/png'], 2 * 1024 * 1024)]
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

  validImage(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.registerForm.patchValue({ image: file });
      this.registerForm.get('image')!.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const size = 128;
            canvas.width = size;
            canvas.height = size;
            ctx.drawImage(img, 0, 0, size, size);
            this.imagePreview = canvas.toDataURL(file.type);
            canvas.toBlob(blob => {
              const croppedFile = new File([blob!], file.name, { type: file.type });
              this.registerForm.patchValue({ image: croppedFile });
              this.registerForm.get('image')!.updateValueAndValidity();
            }, file.type);
          }
        };
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.registerForm.valid) {
      const formData = new FormData();
      Object.keys(this.registerForm.controls).forEach(key => {
        formData.append(key, this.registerForm.get(key)?.value);
      });

      this.authService.register(formData).subscribe({
        next: response => {
          toast({
            message: 'User has been registered successfully!     ',
            type: 'is-success',
            dismissible: true,
            position: 'top-center',
            duration: 4000,
          });
          this.registerForm.reset();
          this.formSubmitted = false;
        },
        error: error => {
          toast({
            message: 'An error has occurred       ',
            type: 'is-warning',
            dismissible: true,
            position: 'top-center',
            duration: 4000,
          });
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
