import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { FormInput } from '../../../atoms/forms/form-input/form-input';
import { Subscription } from 'rxjs';
import { FormBusService } from '../../../../services/rxjs/form-bus-service/form-bus-service';
import { AlertService } from '../../../../services/rxjs/alert-service/alert-service'; 
import { TableContextType } from '../../../../core/types/table-context.type';

@Component({
  selector: 'app-form-confirm-display-delete',
  imports: [FormInput, ReactiveFormsModule],
  templateUrl: './form-confirm-display-delete.html',
  styleUrl: './form-confirm-display-delete.scss'
})
export class FormConfirmDisplayDelete {
  @Input() name: string | null = "Colégio teste";
  @Input() context!: TableContextType;
  
  private _formBuilder = inject(FormBuilder);
  private _formBusService = inject(FormBusService);
  private _alertService = inject(AlertService);
  private _subscription = new Subscription();

  form!: FormGroup;
  identifier: string | null = null;
  isLoading: boolean = false;

  ngOnInit() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), this._nameEqualsValidator.bind(this)]],
    });

    this._subscription.add(
        this._formBusService.submitForm$.subscribe(() => {
          this._handleSubmit();
        })
    );
  }

  private _handleSubmit() {
    this.form.markAllAsTouched();
    
    if (this.form.invalid) {
      this._alertService.warn('Por favor, digite o nome exatamente como mostrado para confirmar.');
      return;
    }

    this._formBusService.sendPayload({
      source: this.context,
      data: {}
    });
  }

  private _nameEqualsValidator(control: AbstractControl) {
    if (this.name === null || this.name === undefined) {
      return null;
    }
    return control.value === this.name ? null : { notEqual: { expected: this.name, actual: control.value } };
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
