import { Component, inject } from '@angular/core';
import { Table } from '../../shared/organisms/table/table';
import { TableTdType } from '../../core/types/table-td.type';
import { Observable } from 'rxjs';
import { TableContextEnum } from '../../core/types/table-context.type';
import { InstitutionService } from '../../services/api/institution-service/institution-service';
import { CommonModule } from '@angular/common';
import { ITableRow } from '../../core/models/table.model';

@Component({
  standalone: true,
  selector: 'app-institutions',
  imports: [Table, CommonModule],
  templateUrl: './page-institutions.html',
  styleUrl: './page-institutions.scss'
})
export class PageInstitutions {
  TableTdType = TableTdType;
  TableContextEnum = TableContextEnum;

  private _institutionService = inject(InstitutionService);
  public _rows$!: Observable<ITableRow[]>;

  _columns = [ 
    {
      key: 'name',
      type: TableTdType.Text
    },
  ]

  ngOnInit() {
    this._rows$ = this._institutionService.getInstitutions();
  }
}
