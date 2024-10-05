import { ChangeDetectorRef, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { catchError, finalize, map, Observable, of } from "rxjs";
import { HttpService } from "./http.service";

@Injectable({
  providedIn: 'root'
})
export class NewUsernameValidator implements AsyncValidator {

  constructor(private http: HttpService, private ref: ChangeDetectorRef) { }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.http.post(`checkUsername`, { username: control.value }).pipe(
      map(userStatus => {
        return userStatus.isAvailable ? null : { username: { isAvailable: false }} }
      ),
      catchError(() => of({ username: { isAvailable: false }})),
      finalize(() => this.ref.markForCheck())
    )
  }
}
