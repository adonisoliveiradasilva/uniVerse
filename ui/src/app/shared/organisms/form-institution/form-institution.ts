import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormInput } from '../../atoms/forms/form-input/form-input';
import { Divider } from '../../atoms/divider/divider';
import { TableTdType } from '../../../core/types/table-td.type';
import { TableAction, TableContextEnum } from '../../../core/types/table-context.type';
import { Table } from '../table/table';
import { Subscription } from 'rxjs';
import { FormBus } from '../../../services/rxjs/form-bus/form-bus';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ITableRow } from '../../../core/models/table.model';
import { FormModal } from '../../../services/rxjs/form-modal/form-modal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-institution',
  imports: [FormInput, Divider, Table, ReactiveFormsModule, CommonModule],
  templateUrl: './form-institution.html',
  styleUrl: './form-institution.scss'
})
export class FormInstitution {
  private _formBusService = inject(FormBus);
  private _formBuilder = inject(FormBuilder);
  private _subscription = new Subscription();
  private _cdr = inject(ChangeDetectorRef);
  private _formModalService = inject(FormModal)

  TableTdType = TableTdType;
  TableContextEnum = TableContextEnum;

  action: TableAction | null = null;

  form!: FormGroup;

  _rows: ITableRow[] = [
    {
      id: 'DECEA',
      name: 'DECEA'
    },
    {
      id: 'DECSI',
      name: 'DECSI'
    },
    {
      id: 'DEELT',
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
      nameInstitution: ['', [Validators.required, Validators.minLength(3)]],
      acronymInstitution: ['', [Validators.required, Validators.minLength(3)]],
    });

    this._formModalService.modalStack$.subscribe(stack => {
      this.action = stack.at(-1)?.action ?? null;
    });

    this._subscription.add(
      this._formBusService.submitForm$.subscribe(() => {
        this._handleSubmit();
      })
    );

    this._formBusService.formPayload$.subscribe(payload => {
      if (payload && payload.source === TableContextEnum.Department) {
        this._rows = [
          ...this._rows,
          {
            id: payload.data.acronymDepartment,
            name: payload.data.nameDepartment
          }
        ];
        this._cdr.detectChanges();
      }
    })
  }

  private _handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      source: TableContextEnum.Institution,
      data: this.form.value
    }

    this._formBusService.sendPayload(payload);
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
