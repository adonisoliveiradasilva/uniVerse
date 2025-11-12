import { Component, inject } from '@angular/core';
import { Table } from '../../shared/organisms/table/table';
import { TableTdType } from '../../core/types/table-td.type';
import { BehaviorSubject, catchError, map, Observable, of, switchMap } from 'rxjs';
import { TableContextEnum } from '../../core/types/table-context.type';
import { CommonModule } from '@angular/common';
import { ITableRow } from '../../core/models/table.model';
import { DatePeriodSelector } from '../../shared/molecules/date-period-selector/date-period-selector';
import { SubjectService } from '../../services/api/subject-service/subject-service';

@Component({
  selector: 'app-page-periods',
  imports: [CommonModule, Table, DatePeriodSelector],
  templateUrl: './page-periods.html',
  styleUrl: './page-periods.scss'
})
export class PagePeriods {
  TableTdType = TableTdType;
  TableContextEnum = TableContextEnum;

  private _period$ = new BehaviorSubject<number>(1);
  private _subjectService = inject(SubjectService);

  public periodLabel$: Observable<string> = this._period$.pipe(
    map(period => `Período ${period}`)
  );

  _columns = [
    {
      key: 'name',
      type: TableTdType.Text
    },
  ];

  public _rows$!: Observable<ITableRow[]>; //temporario enquando não fica pronto a api e a service

  ngOnInit() {
    this._rows$ = this._subjectService.getSubjects();
  }
  // public _rows$: Observable<ITableRow[]> = this._period$.pipe(    
    // switchMap((period: string) => 
    //   this._subjectService.getSubjectByCode(period).pipe(
    //     catchError(err => {
    //       console.error("Falha ao buscar disciplinas do período:", err);
    //       return of([]); 
    //     })
    //   )
    // ),
  // );

navigate(navigate: 'left' | 'right') { 
    const currentPeriod = this._period$.getValue();

    if(navigate === 'left' && currentPeriod > 1) {
      this._period$.next(currentPeriod - 1);
    }
    else if(navigate === 'right' && currentPeriod < 20) { 
      this._period$.next(currentPeriod + 1);
    }
  }
}
