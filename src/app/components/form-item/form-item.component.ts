import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CountryAutocompleteComponent } from "../country-autocomplete/country-autocomplete.component";
import { NgIf } from "@angular/common";
import { DynamicValidatorMessage } from "../../directives";
import { OnTouchErrorStateMatcher } from "../../services";

@Component({
  selector: 'app-form-item',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CountryAutocompleteComponent,
    NgIf,
    DynamicValidatorMessage
  ],
  templateUrl: './form-item.component.html',
  styleUrl: './form-item.component.scss',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormItemComponent {
  @Input() options: string[] = [];
  @Output() removeItemChange = new EventEmitter<number>();

  public showErrorStrategy = new OnTouchErrorStateMatcher();
}
