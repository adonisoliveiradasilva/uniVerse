import { Component, inject } from '@angular/core';
import { Table } from '../../shared/organisms/table/table';
import { TableTdType } from '../../core/types/table-td.type';
import { FormModal } from '../../services/rxjs/form-modal/form-modal';
import { Observable, Subscription } from 'rxjs';
import { TableContextEnum } from '../../core/types/table-context.type';
import { InstitutionService } from '../../services/api/institution/institution';
import { CommonModule } from '@angular/common';
import { ITableRow } from '../../core/models/table.model';
import { AlertService } from '../../services/rxjs/alert/alert';

@Component({
  standalone: true,
  selector: 'app-institutions',
  imports: [Table, CommonModule],
  templateUrl: './institutions.html',
  styleUrl: './institutions.scss'
})
export class Institutions {
  TableTdType = TableTdType;
  TableContextEnum = TableContextEnum;

  private _alertService = inject(AlertService)
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
    this._alertService.success("Instituição cadastrada com sucesso");
    this._alertService.error("Instituição não cadastrada com sucesso");
    this._alertService.warn("Nome da instituição precisa ter mais de 3 letras");
    this._rows$ = this._institutionService.getInstitutions();
  }
}
