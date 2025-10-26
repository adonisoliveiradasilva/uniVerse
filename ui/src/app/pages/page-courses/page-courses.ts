import { Component, inject } from '@angular/core';
import { Table } from '../../shared/organisms/table/table';
import { TableTdType } from '../../core/types/table-td.type';
import { Observable } from 'rxjs';
import { TableContextEnum } from '../../core/types/table-context.type';
import { CommonModule } from '@angular/common';
import { ITableRow } from '../../core/models/table.model';
import { CourseService } from '../../services/api/course-service/course-service';

@Component({
  selector: 'app-page-courses',
  imports: [CommonModule, Table],
  templateUrl: './page-courses.html',
  styleUrl: './page-courses.scss'
})
export class PageCourses {
  TableTdType = TableTdType;
  TableContextEnum = TableContextEnum;

  private _courseService = inject(CourseService);
  public _rows$!: Observable<ITableRow[]>;

  _columns = [
    {
      key: 'name',
      type: TableTdType.Text
    },
  ];

  ngOnInit() {
    this._rows$ = this._courseService.getCourses();
  }
}
