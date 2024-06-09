import { AbstractControl, ValidatorFn } from '@angular/forms';

export function fileValidator(allowedTypes: string[], maxSize: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const file = control.value;

    if (!file) {
      return null;
    }

    if (!allowedTypes.includes(file.type)) {
      return { 'invalidFileType': true };
    }

    if (!(file.size <= maxSize)) {
      return { 'invalidFileSize': true };
    }

    return null;
  };
}
