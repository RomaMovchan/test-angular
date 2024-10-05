import { ChangeDetectorRef, inject, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { catchError, finalize, map, Observable, of } from "rxjs";

import { HttpService } from "./http.service";
import { CheckUserResponseData } from "../shared/interface/responses";

@Injectable({
  providedIn: 'root'
})
export class NewUsernameValidator implements AsyncValidator {
  private http: HttpService = inject(HttpService);
  private ref: ChangeDetectorRef = inject(ChangeDetectorRef);

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.http.post(`checkUsername`, { username: control.value }).pipe(
      map((userStatus: CheckUserResponseData) => {
        return userStatus.isAvailable ? null : { username: { isAvailable: false }} }
      ),
      catchError(() => of({ username: { isAvailable: false }})),
      finalize(() => this.ref.markForCheck())
    )
  }
}
