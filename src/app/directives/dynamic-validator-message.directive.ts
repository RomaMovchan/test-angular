import { ComponentRef, Directive, ElementRef, inject, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ControlContainer, FormGroupDirective, NgControl, NgForm, NgModel } from "@angular/forms";
import { EMPTY, fromEvent, iif, merge, skip, startWith, Subscription} from "rxjs";

import { ErrorStateMatcher } from "../services";
import { InputErrorComponent } from "../components/input-error/input-error.component";

@Directive({
  selector: `
    [ngModel],[formControl],[formControlName],
    [formGroupName],[ngModelGroup]
    `,
  standalone: true,
})
export class DynamicValidatorMessage implements OnInit, OnDestroy {
  ngControl = inject(NgControl, { self: true, optional: true })
    || inject(ControlContainer, { self: true});
  elementRef = inject(ElementRef);

  @Input() container = inject(ViewContainerRef);
  private componentRef: ComponentRef<InputErrorComponent> | null = null;
  private errorMessageTrigger!: Subscription;
  private parentContainer = inject(ControlContainer, { optional: true });

  @Input() errorStateMatcher = inject(ErrorStateMatcher);

  get form() {
    return this.parentContainer?.formDirective as NgForm | FormGroupDirective | null;
  }

  ngOnInit() {
    queueMicrotask(() => {
      if (!this.ngControl.control)
        throw Error(`No control model for ${this.ngControl.name} control...`);
      this.errorMessageTrigger = merge(
        this.ngControl?.control?.statusChanges,
        fromEvent(this.elementRef.nativeElement, 'blur'),
        iif(() => !!this.form, this.form!.ngSubmit, EMPTY)
      )
        .pipe(
          startWith(this.ngControl?.control?.status),
          skip(this.ngControl instanceof NgModel ? 1 : 0),
        )
        .subscribe(() => {
          if (this.errorStateMatcher.isErrorVisible(this.ngControl.control, this.form)) {
            if (!this.componentRef) {
              this.componentRef = this.container.createComponent(InputErrorComponent);
              this.componentRef.changeDetectorRef.markForCheck();
            }
            this.componentRef.setInput('errors', this.ngControl.errors);
          } else {
            this.componentRef?.destroy();
            this.componentRef = null;
          }
        })
    })
  }

  ngOnDestroy(): void {
    this.errorMessageTrigger?.unsubscribe();
  }
}
