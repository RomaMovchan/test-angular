import { Injectable } from '@angular/core';
import {AbstractControl, FormGroupDirective, NgForm} from "@angular/forms";

export interface ErrorStateMatcher {
  isErrorVisible(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean
}

@Injectable({
  providedIn: 'root'
})
export class ErrorStateMatcher {

  isErrorVisible(control: AbstractControl | null, form: NgForm | FormGroupDirective | null) {
    return Boolean(control && control.invalid && (control.dirty || (form && form.submitted)));
  }
}

export class OnTouchErrorStateMatcher implements ErrorStateMatcher {

  isErrorVisible(control: AbstractControl | null, form: NgForm | FormGroupDirective | null) {
    return Boolean(control && control.invalid && (control.touched || (form && form.submitted)));
  }
}
