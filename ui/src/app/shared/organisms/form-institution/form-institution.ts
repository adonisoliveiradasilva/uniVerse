import { Component, inject } from '@angular/core';
import { FormInput } from '../../atoms/forms/form-input/form-input';
import { Divider } from '../../atoms/divider/divider';
import { TableTdType } from '../../../core/types/table-td.type';
import { TableContextEnum } from '../../../core/types/table-context.type';
import { Table } from '../table/table';
import { Subscription } from 'rxjs';
import { FormBus } from '../../../services/rxjs/form-bus/form-bus';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-institution',
  imports: [FormInput, Divider, Table, ReactiveFormsModule],
  templateUrl: './form-institution.html',
  styleUrl: './form-institution.scss'
})
export class FormInstitution {
  private _formBus = inject(FormBus);
  private _formBuilder = inject(FormBuilder);
  private _subscription = new Subscription();

  TableTdType = TableTdType;
  TableContextEnum = TableContextEnum;

  form!: FormGroup;

  _rows = [
    {
      id: 1,
      name: 'DECEA'
    },
    {
      id: 2,
      name: 'DECSI'
    },
    {
      id: 3,
      name: 'DEELT'
    }
  ]

  _columns = [ 
    {
      key: 'name',
      header: 'Nome do departamento',
      type: TableTdType.Text
    },
  ]

  ngOnInit() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
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

    this._formBus.sendPayload(this.form.value);
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
