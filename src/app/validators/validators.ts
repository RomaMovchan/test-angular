import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function restrictedCountries(countries: string[] = []): ValidatorFn {
  return (control: AbstractControl<string | null>): ValidationErrors | null => {
    if (control.value) {
      const match = countries.find(
        c => c.toLowerCase() === control.value?.toLowerCase());
      return match
        ? null
        : { restrictedCountries: { country: control.value} }
    } else {
      return null;
    }
  }
}

export function currentDate(): ValidatorFn {
  return (control: AbstractControl<string | null>): ValidationErrors | null => {
    if (control.value) {
      const dateNow = new Date().getTime();
      const date = new Date(control.value).getTime();
      return dateNow < date ? null : { dateError: true };
    } else {
      return null;
    }
  }
}
