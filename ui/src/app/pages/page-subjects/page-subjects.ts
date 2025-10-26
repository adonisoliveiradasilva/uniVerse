import { Component, inject } from '@angular/core';
import { Table } from '../../shared/organisms/table/table';
import { TableTdType } from '../../core/types/table-td.type';
import { Observable } from 'rxjs';
import { TableContextEnum } from '../../core/types/table-context.type';
import { CommonModule } from '@angular/common';
import { ITableRow } from '../../core/models/table.model';
import { SubjectService } from '../../services/api/subject-service/subject-service';

@Component({
  selector: 'app-page-subjects',
  imports: [CommonModule, Table],
  templateUrl: './page-subjects.html',
  styleUrl: './page-subjects.scss'
})
export class PageSubjects {
  TableTdType = TableTdType;
  TableContextEnum = TableContextEnum;

  private _subjectService = inject(SubjectService);
  public _rows$!: Observable<ITableRow[]>;

  _columns = [
    {
      key: 'name',
      type: TableTdType.Text
    },
  ];

  ngOnInit() {
    this._rows$ = this._subjectService.getSubjects();
  }
}
