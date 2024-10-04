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
import {NgForOf} from "@angular/common";
import {FormItemComponent} from "../form-item/form-item.component";

type TestForm = FormGroup<{
  country: FormControl<string>;
  username: FormControl<string>;
  birthday: FormControl<string>;
}>;

@Component({
  selector: 'app-forms-section',
  standalone: true,
  imports: [ReactiveFormsModule, NgForOf, FormItemComponent],
  templateUrl: './forms-section.component.html',
  styleUrl: './forms-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormsSectionComponent {
  private fb: FormBuilder = inject(FormBuilder);
  public formArray = new FormArray<TestForm>([]);

  private registerFormGroup(): FormGroup {
    return <TestForm>this.fb.group({
      country: ['', [
        Validators.required,
      ]],
      username: ['', [
        Validators.required,
      ]],
      birthday: ['', [
        Validators.required,
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

}
