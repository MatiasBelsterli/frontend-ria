import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from "../../../services/users/user.service";
import { toast } from "bulma-toast";


@Component({
  selector: 'app-forgot-modal',
  templateUrl: './forgot-modal.component.html',
  styleUrl: './forgot-modal.component.scss'
})
export class ForgotModalComponent {
  @Input() isModalActive: boolean = false;
  @Output() closeModalEvent = new EventEmitter<void>();
  forgotPass: FormGroup;
  formSubmitted = false;

  constructor(fb: FormBuilder, private userService: UserService) {
    this.forgotPass = fb.group({
      email: ['', Validators.required],
    });
  }

  closeModal(): void {
    this.forgotPass.reset()
    this.formSubmitted = false;
    this.closeModalEvent.emit();
  }

  forgot() {
    this.formSubmitted = true;
    if (!this.forgotPass.valid) return
    this.userService.forgotPassword(this.forgotPass.get('email')?.value ?? '').subscribe({
      next: () => {
        toast({
          message: 'Email sent successfully!      ',
          type: 'is-success',
          position: 'top-center',
          duration: 3000,
          dismissible: true,
        })
        this.closeModal()
      },
      error: () => {
        toast({
          message: 'Error sending recovery email      ',
          type: 'is-danger',
          position: 'top-center',
          duration: 3000,
          dismissible: true,
        })
      }
    })
  }
}
