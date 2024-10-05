import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ElementRef, HostBinding, HostListener, inject,
  Input, OnDestroy, OnInit, Renderer2, ViewChild
} from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { delay, distinctUntilChanged, Subscription, switchMap } from "rxjs";
import { NgForOf, NgIf } from "@angular/common";
import { HttpService } from "../../services";

@Component({
  selector: 'app-country-autocomplete',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, NgIf, NgForOf ],
  templateUrl: './country-autocomplete.component.html',
  styleUrl: './country-autocomplete.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CountryAutocompleteComponent,
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryAutocompleteComponent implements ControlValueAccessor, OnDestroy, OnInit {
  @ViewChild('input', { static: false }) public inputElement: ElementRef | undefined;
  @Input() id: string = '';
  @Input() @HostBinding('attr.tabIndex') tabIndex: number = 0;
  @Input() minChars: number = 3;

  @HostListener('blur') onBlur(): void {
    this.onTouch();
  }
  @Input() options: string[] = [];
  public filteredOptions: string[] = [];
  public isOpen: boolean = false;
  private subscription: Subscription = new Subscription();
  @Input() val: string = '';
  public inputControl = new FormControl();

  clickListener: Function;

  onChange: (newValue: string) => void = (): void => {};
  onTouch: () => void = (): void => {};
  private ref: ChangeDetectorRef = inject(ChangeDetectorRef);
  private renderer: Renderer2 = inject(Renderer2);
  private elementRef: ElementRef = inject(ElementRef);
  private httpService: HttpService = inject(HttpService);

  constructor() {
    this.clickListener = this.renderer.listen('document', 'click', (event: MouseEvent) => this.handleGlobalClick(event))
  }

  ngOnInit(): void {
    /*Not clear requirements about datasource of Countries. Regarding requirement:
          "First input, Country should be a text input. While the user types, it should suggest values
           from the Country enum (src/app/shared/enum/country.ts). It should validate and not
           allow to submit forms with values not listed in the Country enum."
      datasource should be simple enum, but in the text mentioned datasource from /api/regions - method
      doesn't implemented on fakeBackend file.
      Two different types of implementation. Second option implemented using switchMap rxjs operator.
      Solution was commented
     */
    this.subscription = this.inputControl.valueChanges
      .subscribe(value => {
        this.updateValue(value);
        if (value) {
          this.filteredOptions = this.options?.filter(option => option.toLowerCase().includes(value.toLowerCase()))
        } else {
          this.filteredOptions = [];
        }
        this.isOpen = Boolean(this.filteredOptions.length > 0);
      });

    // Second variant of implementation
    /*this.subscription = this.inputControl.valueChanges.pipe(
      delay(1000),
      distinctUntilChanged(),
      switchMap(value => {
        this.updateValue(value);
        return this.httpService.get('regions')
      })
    ).subscribe((countries: string[]) => {});*/
  }

  private handleGlobalClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.ref.detectChanges();
    }
  }

  public selectItem(item: string): void {
    this.inputControl.patchValue(item);
    this.isOpen = false;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(obj: string): void {
    if (obj === null) {
      this.inputControl.reset();
    }
    this.onChange(obj);
    this.ref.markForCheck();
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.inputControl.disable() : this.inputControl.enable();
    this.ref.markForCheck();
  }

  private updateValue(val: string): void {
    if (val !== undefined && val !== null && this.val !== val) {
      this.val = val;
      this.onChange(val);
      this.onTouch();
    }
  }
}
