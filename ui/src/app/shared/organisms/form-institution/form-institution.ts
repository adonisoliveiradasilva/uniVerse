import { Component } from '@angular/core';
import { FormInput } from '../../atoms/forms/form-input/form-input';
import { Divider } from '../../atoms/divider/divider';
import { TableTdType } from '../../../core/types/table-td.type';
import { TableContextEnum } from '../../../core/types/table-context.type';
import { Table } from '../table/table';

@Component({
  selector: 'app-form-institution',
  imports: [FormInput, Divider, Table],
  templateUrl: './form-institution.html',
  styleUrl: './form-institution.scss'
})
export class FormInstitution {
  TableTdType = TableTdType;
  TableContextEnum = TableContextEnum;

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
}
