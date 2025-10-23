import { Component, inject } from '@angular/core';
import { FormInput } from '../../atoms/forms/form-input/form-input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBus } from '../../../services/rxjs/form-bus/form-bus';
import { Subscription } from 'rxjs';
import { FormModal } from '../../../services/rxjs/form-modal/form-modal';
import { TableContextEnum } from '../../../core/types/table-context.type';

@Component({
  selector: 'app-form-department',
  imports: [FormInput, ReactiveFormsModule],
  templateUrl: './form-department.html',
  styleUrl: './form-department.scss'
})
export class FormDepartment {
  private _formBus = inject(FormBus);
  private _formBuilder = inject(FormBuilder);
  private _subscription = new Subscription();
  private _formModalService = inject(FormModal)

  form!: FormGroup;

  ngOnInit() {
    this.form = this._formBuilder.group({
      nameDepartment: ['', [Validators.required, Validators.minLength(3)]],
      acronymDepartment: ['', [Validators.required, Validators.minLength(3)]],
    });

    this._subscription.add(
      this._formBus.submitForm$.subscribe(() => {
        this._handleSubmit();
      })
    );
  }

  private _handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      source: TableContextEnum.Department,
      data: this.form.value
    }

    this._formBus.sendPayload(payload);
    this._formModalService.closeModal();
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
