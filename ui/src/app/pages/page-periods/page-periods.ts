import { Component, inject, OnInit } from '@angular/core';
import { Table } from '../../shared/organisms/table/table';
import { TableTdType } from '../../core/types/table-td.type';
import { combineLatest, map, Observable, of } from 'rxjs'; // 1. Imports
import { TableContextEnum } from '../../core/types/table-context.type';
import { CommonModule } from '@angular/common';
import { ITableRow } from '../../core/models/table.model';
import { DatePeriodSelector } from '../../shared/molecules/date-period-selector/date-period-selector';
import { PeriodService } from '../../services/api/period-service/period-service';
import { IPeriod } from '../../core/models/entitys/IPeriod.model';
import { Button } from '../../shared/atoms/buttons/button/button';

@Component({
  selector: 'app-page-periods',
  imports: [CommonModule, Table, DatePeriodSelector, Button],
  templateUrl: './page-periods.html',
  styleUrl: './page-periods.scss'
})
export class PagePeriods implements OnInit {
  TableTdType = TableTdType;
  TableContextEnum = TableContextEnum;

  private _periodService = inject(PeriodService);

  public periodLabel$!: Observable<string>;
  public _rows$!: Observable<ITableRow[]>;
  
  private _allPeriods: IPeriod[] = [];

  _columns = [
    { key: 'name', label: 'Nome da Disciplina', type: TableTdType.Text },
    { key: 'status', label: 'Status', type: TableTdType.Text },
    { key: 'grade', label: 'Nota', type: TableTdType.Text },
    { key: 'absences', label: 'Faltas', type: TableTdType.Text },
  ];
  _headers = ['Nome', 'Status', 'Nota', 'Faltas'];

  ngOnInit() {
    this._rows$ = this._periodService.currentPeriodSubjects$.pipe(
      map(enrolledSubjects => 
        enrolledSubjects.map(subject => ({
          id: subject.subjectCode,
          name: subject.subjectCode,
          status: subject.status,
          grade: subject.grade,
          absences: subject.absences
        } as ITableRow))
      )
    );

    this._periodService.periods$.subscribe(periods => {
      this._allPeriods = periods;
    });

    this.periodLabel$ = combineLatest([
      this._periodService.periods$,
      this._periodService.currentPeriodId$
    ]).pipe(
      map(([periods, currentId]) => {
        const currentIndex = periods.findIndex(p => p.id === currentId);
        const currentLabel = currentIndex + 1;
        return `Período ${currentLabel} de ${periods.length}`;
      })
    );
  }

  get getAllPeriods(): IPeriod[]{
    return this._allPeriods;
  }

  navigate(navigate: 'left' | 'right') { 
    const currentId = this._periodService.getCurrentPeriodId();
    if (currentId === null) return;

    const currentIndex = this._allPeriods.findIndex(p => p.id === currentId);

    if (navigate === 'left' && currentIndex > 0) {
      const prevPeriodId = this._allPeriods[currentIndex - 1].id;
      this._periodService.fetchSubjectsForPeriod(prevPeriodId).subscribe();
    } 
    else if (navigate === 'right' && currentIndex < this._allPeriods.length - 1) {
      const nextPeriodId = this._allPeriods[currentIndex + 1].id;
      this._periodService.fetchSubjectsForPeriod(nextPeriodId).subscribe();
    }
  }

  createPeriod() {
    this._periodService.createPeriod().subscribe({
      next: (newPeriod) => {
        this._periodService.fetchSubjectsForPeriod(newPeriod.id).subscribe();
      },
      error: (err) => {
        console.error('Falha ao criar período', err);
      }
    });
  }
}