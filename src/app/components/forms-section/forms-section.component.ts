import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { AsyncPipe, DatePipe, NgForOf, NgIf } from "@angular/common";

import { HttpClientModule } from "@angular/common/http";
import { finalize, map, Observable, share, takeWhile, timer } from "rxjs";
import { SubmitFormResponseData } from "../../shared/interface/responses";
import { FormItemComponent } from "../form-item/form-item.component";
import { currentDate, restrictedCountries } from "../../validators/validators";
import { Country } from "../../shared/enum/country";
import { NewUsernameValidator } from "../../services";
import { HttpService } from "../../services";

type TestForm = FormGroup<{
  country: FormControl<string>;
  username: FormControl<string>;
  birthday: FormControl<string>;
}>;

const TIMER = 5;

@Component({
  selector: 'app-forms-section',
  standalone: true,
  imports: [ ReactiveFormsModule, NgForOf, FormItemComponent, NgIf, HttpClientModule, AsyncPipe, DatePipe ],
  templateUrl: './forms-section.component.html',
  styleUrl: './forms-section.component.scss',
  providers: [ NewUsernameValidator ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormsSectionComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private httpService: HttpService = inject(HttpService);
  private newUsernameValidator: NewUsernameValidator = inject(NewUsernameValidator);

  public formArray = new FormArray<TestForm>([]);
  public countries = Object.values(Country);
  public timer$: Observable<number> | null = new Observable<number>();

  private registerFormGroup(): FormGroup {
    return this.fb.group({
      country: ['', [
        Validators.required,
        restrictedCountries(this.countries)
      ]],
      username: ['', {
        validators: [
          Validators.required
        ],
        asyncValidators: [
          this.newUsernameValidator.validate.bind(this.newUsernameValidator)
        ],
       // updateOn: 'blur'
      }],
      birthday: ['', [
        Validators.required,
        currentDate()
      ]]
    })
  }

  public getFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  public addItem(): void {
    this.formArray.push(this.registerFormGroup());
  }

  public handleRemoveItem(index: number): void {
    this.formArray.removeAt(index);
  }

  get invalidFormsLength(): number {
    const invalidForms = this.formArray.controls.filter(c => c.invalid);
    return invalidForms.length
  }

  get isFormInvalid(): boolean {
    return !this.formArray.valid || !this.formArray.controls.length
  }

  private startTimer(): void {
    this.timer$ = timer(0, 1000)
      .pipe(
        share(),
        map(n => (TIMER - n) * 1000),

        takeWhile(n => n >= 0),
        finalize(() => {
          this.stopTimer();
          this.submitForm();
        })
      );
  }

  private stopTimer(): void {
    this.timer$ = null;
  }

  public submit(): void {
    this.disableForms();
    this.startTimer();
  }

  private disableForms(): void {
    this.formArray.disable();
  }

  private enableForms(): void {
    this.formArray.enable();
  }

  public submitForm(): void {
    this.httpService.post('submitForm', this.formArray.value)
      .subscribe((data: SubmitFormResponseData) => {
        this.formArray.enable();
        this.resetForm();
        alert(data.result);
      });
  }

  cancel(): void {
    this.stopTimer();
    this.enableForms();
  }

  resetForm() {
    this.formArray.reset();
    this.formArray.markAsPristine();
    this.formArray.markAsUntouched();
  }
}
