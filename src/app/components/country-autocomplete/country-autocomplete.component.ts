import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-country-autocomplete',
  standalone: true,
  imports: [],
  templateUrl: './country-autocomplete.component.html',
  styleUrl: './country-autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryAutocompleteComponent {

}
