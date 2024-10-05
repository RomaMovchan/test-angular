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
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {FormItemComponent} from "../form-item/form-item.component";
import {currentDate, restrictedCountries} from "../../validators/validators";
import {Country} from "../../shared/enum/country";

type TestForm = FormGroup<{
  country: FormControl<string>;
  username: FormControl<string>;
  birthday: FormControl<string>;
}>;

@Component({
  selector: 'app-forms-section',
  standalone: true,
  imports: [ReactiveFormsModule, NgForOf, FormItemComponent, JsonPipe, NgIf],
  templateUrl: './forms-section.component.html',
  styleUrl: './forms-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormsSectionComponent {
  private fb: FormBuilder = inject(FormBuilder);
  public formArray = new FormArray<TestForm>([]);
  public countries = Object.values(Country);

  private registerFormGroup(): FormGroup {
    return <TestForm>this.fb.group({
      country: ['', [
        Validators.required,
        restrictedCountries(this.countries)
      ]],
      username: ['', [
        Validators.required,
      ]],
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
}
