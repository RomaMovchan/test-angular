import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {ControlContainer, FormGroupDirective, FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-form-item',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
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
}
