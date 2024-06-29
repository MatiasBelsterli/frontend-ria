import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from "../../services/users/user.service";
import { User } from '../../models/users/user.model';
import { fileValidator } from "../../validators/file-validator";
import { UserRole } from "../../enums/user-role";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: User | undefined;
  isEditModalActive = false;
  editForm: FormGroup;
  formSubmitted = false;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.editForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(11)]],
      image: ['', fileValidator(['image/jpeg', 'image/png'], 2 * 1024 * 1024)]
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.getUserById(Number(userId)).subscribe(
        (data: User) => {
          this.user = data;
          this.editForm.patchValue({
            firstName: data.name,
            lastName: data.lastName,
            phone: data.phone
          });
          this.imagePreview = data.image ? 'data:image/jpeg;base64,' + data.image : null;
        },
        (error: any) => console.error('Failed to load user data', error)
      );
    }
  }

  openEditModal() {
    this.isEditModalActive = true;
  }

  closeEditModal() {
    this.isEditModalActive = false;
  }

  validImage(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.editForm.patchValue({ image: file });
      this.editForm.get('image')!.updateValueAndValidity();

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
              this.editForm.patchValue({ image: croppedFile });
              this.editForm.get('image')!.updateValueAndValidity();
            }, file.type);
          }
        };
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmitEdit() {
    this.formSubmitted = true;
    if (this.editForm.valid) {
      const formData = new FormData();
      formData.append('firstName', this.editForm.get('firstName')?.value);
      formData.append('lastName', this.editForm.get('lastName')?.value);
      formData.append('phone', this.editForm.get('phone')?.value);
      if (this.editForm.get('image')?.value) {
        formData.append('image', this.editForm.get('image')?.value);
      }
      this.userService.updateUser(formData).subscribe(
        (response: any) => {
          console.log('User updated successfully', response);
          this.loadUserData();
          this.closeEditModal();
        },
        (error: any) => console.error('Failed to update user data', error)
      );
    }
  }

    protected readonly UserRole = UserRole;
}
