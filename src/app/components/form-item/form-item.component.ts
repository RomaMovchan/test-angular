import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {ControlContainer, FormGroupDirective, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CountryAutocompleteComponent} from "../country-autocomplete/country-autocomplete.component";
import {Country} from "../../shared/enum/country";

@Component({
  selector: 'app-form-item',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CountryAutocompleteComponent
  ],
  templateUrl: './form-item.component.html',
  styleUrl: './form-item.component.scss',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormItemComponent {
  @Output() removeItemChange = new EventEmitter<number>();

  public options = Object.values(Country);
}
