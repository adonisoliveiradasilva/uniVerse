import { Component, inject } from '@angular/core';
import { Table } from '../../shared/organisms/table/table';
import { TableTdType } from '../../core/types/table-td.type';
import { FormModal } from '../../services/rxjs/form-modal/form-modal';
import { Observable, Subscription } from 'rxjs';
import { TableContextEnum } from '../../core/types/table-context.type';
import { InstitutionService } from '../../services/api/institution/institution';
import { IInstitution } from '../../core/models/entitys/IInstitution.model';
import { CommonModule } from '@angular/common';
import { ITableRow } from '../../core/models/table.model';

@Component({
  selector: 'app-institutions',
  imports: [Table, CommonModule],
  templateUrl: './institutions.html',
  styleUrl: './institutions.scss'
})
export class Institutions {
  TableTdType = TableTdType;
  TableContextEnum = TableContextEnum;

  private _institutionService = inject(InstitutionService);
  public _rows$!: Observable<ITableRow[]>;

  _columns = [ 
    {
      key: 'name',
      header: 'Nome da Instituição',
      type: TableTdType.Text
    },
  ]

  ngOnInit() {
    this._rows$ = this._institutionService.getInstitutions();
  }
}
