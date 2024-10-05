import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, ControlContainer, FormGroupDirective, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CountryAutocompleteComponent} from "../country-autocomplete/country-autocomplete.component";
import {JsonPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-form-item',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CountryAutocompleteComponent,
    NgIf,
    JsonPipe
  ],
  templateUrl: './form-item.component.html',
  styleUrl: './form-item.component.scss',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormItemComponent implements OnInit {
  @Output() removeItemChange = new EventEmitter<number>();
  @Input() options: string[] = [];
  public parentGroupDir = inject(ControlContainer);

  ngOnInit() {
  }

  getControl(name: string): AbstractControl {
    return this.parentGroupDir.control?.get(name) as AbstractControl;
  }
}
