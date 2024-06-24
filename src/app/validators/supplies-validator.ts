import { ValidatorFn, AbstractControl, FormArray } from '@angular/forms';

export function noDuplicateSupplies(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!(control instanceof FormArray)) {
      return null;
    }

    const supplyIds = control.controls.map(group => group.get('supplyId')?.value);
    const hasDuplicates = new Set(supplyIds).size !== supplyIds.length;

    return hasDuplicates ? { 'duplicateSupplies': true } : null;
  };
}
