import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { FormInput } from '../../../atoms/forms/form-input/form-input';


@Component({
  selector: 'app-form-confirm-display-delete',
  imports: [FormInput, ReactiveFormsModule],
  templateUrl: './form-confirm-display-delete.html',
  styleUrl: './form-confirm-display-delete.scss'
})
export class FormConfirmDisplayDelete {
  @Input() name: string | null = "Colégio teste";
  
  private _formBuilder = inject(FormBuilder);

  form!: FormGroup;
  identifier: string | null = null;
  isLoading: boolean = false;

  ngOnInit() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), this.nameEqualsValidator.bind(this)]],
    });
  }

  private nameEqualsValidator(control: AbstractControl) {
    if (this.name === null || this.name === undefined) {
      return null;
    }
    return control.value === this.name ? null : { notEqual: { expected: this.name, actual: control.value } };
  }
}
