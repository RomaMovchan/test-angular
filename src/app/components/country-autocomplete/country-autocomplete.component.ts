import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ElementRef, HostBinding, HostListener,
  Input, OnDestroy, OnInit, Renderer2, ViewChild
} from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { Subscription } from "rxjs";
import { NgForOf, NgIf } from "@angular/common";

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
  @Input() disabled: boolean = false;
  @Input() options: string[] = [];
  public filteredOptions: string[] = [];
  public isOpen: boolean = false;
  private subscription: Subscription = new Subscription();
  val: string = '';
  public inputControl = new FormControl();

  clickListener: Function;

  onChange: (newValue: string) => void = (): void => {};
  onTouch: () => void = (): void => {};

  constructor(
    private ref: ChangeDetectorRef,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {
    this.clickListener = renderer.listen('document', 'click', (event: MouseEvent) => this.handleGlobalClick(event))
  }

  ngOnInit(): void {
    this.subscription = this.inputControl.valueChanges.subscribe(value => {
      this.updateValue(value);
      if (value) {
        this.filteredOptions = this.options?.filter(option => option.toLowerCase().startsWith(value.toLowerCase()))
      } else {
        this.filteredOptions = [];
      }
      this.isOpen = Boolean(this.filteredOptions.length > 0);
    });
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
    this.onChange(obj);
    this.ref.markForCheck();
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
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
