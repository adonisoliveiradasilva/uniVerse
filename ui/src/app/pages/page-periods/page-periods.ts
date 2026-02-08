import { Component, inject, OnInit } from '@angular/core';
import { Table } from '../../shared/organisms/table/table';
import { TableTdType } from '../../core/types/table-td.type';
import { combineLatest, map, Observable } from 'rxjs';
import { TableContextEnum } from '../../core/types/table-context.type';
import { CommonModule } from '@angular/common';
import { ITableRow } from '../../core/models/table.model';
import { DatePeriodSelector } from '../../shared/molecules/date-period-selector/date-period-selector';
import { PeriodService } from '../../services/api/period-service/period-service';
import { IPeriod } from '../../core/models/entitys/IPeriod.model';
import { Button } from '../../shared/atoms/buttons/button/button';
import { NoData } from '../../shared/atoms/no-data/no-data';

@Component({
  selector: 'app-page-periods',
  imports: [CommonModule, Table, DatePeriodSelector, Button, NoData],
  templateUrl: './page-periods.html',
  styleUrl: './page-periods.scss'
})
export class PagePeriods implements OnInit {
  TableTdType = TableTdType;
  TableContextEnum = TableContextEnum;

  public periodService = inject(PeriodService);

  public periodLabel$!: Observable<string>;
  public _rows$!: Observable<ITableRow[]>;
  
  _columns = [
    { key: 'name', label: 'Nome da Disciplina', type: TableTdType.Text },
    { key: 'status', label: 'Status', type: TableTdType.Text },
    { key: 'grade', label: 'Nota', type: TableTdType.Text },
    { key: 'absences', label: 'Faltas', type: TableTdType.Text },
  ];
  _headers = ['Código', 'Status', 'Nota', 'Faltas'];

  ngOnInit() {
    this._rows$ = this.periodService.currentPeriodSubjects$.pipe(
      map(enrolledSubjects => 
        enrolledSubjects.map(subject => ({
          id: subject.subjectCode,
          name: subject.subjectCode,
          status: this._capitalize(subject.status),
          grade: subject.grade,
          absences: subject.absences
        } as ITableRow))
      )
    );

    this.periodLabel$ = combineLatest([
      this.periodService.periods$,
      this.periodService.currentPeriodId$
    ]).pipe(
      map(([periods, currentId]) => {
        if (!periods.length) return 'Sem Períodos';
        const currentIndex = periods.findIndex(p => p.id === currentId);
        if (currentIndex === -1) return 'Selecionar Período'; 
        return `Período ${currentIndex + 1} de ${periods.length}`;
      })
    );

    this._initData();
  }

  private _initData() {
    this.periodService.fetchAllPeriods().subscribe({
      next: (periods) => {
        if (periods.length > 0) {
            const currentId = this.periodService.getCurrentPeriodId();

            const idToLoad = periods.find(p => p.id === currentId) 
                ? currentId 
                : periods[periods.length - 1].id;

            if (idToLoad) {
                this.periodService.fetchSubjectsForPeriod(idToLoad).subscribe();
            }
        }
      },
      error: (err) => console.error('Erro ao carregar períodos iniciais', err)
    });
  }

  navigate(navigate: 'left' | 'right') { 
    const currentId = this.periodService.getCurrentPeriodId();
    const periods = this.periodService.getCurrentPeriodsValue();
    
    if (currentId === null || !periods.length) return;

    const currentIndex = periods.findIndex((p: { id: number; }) => p.id === currentId);

    if (navigate === 'left' && currentIndex > 0) {
      const prevPeriodId = periods[currentIndex - 1].id;
      this.periodService.fetchSubjectsForPeriod(prevPeriodId).subscribe();
    } 
    else if (navigate === 'right' && currentIndex < periods.length - 1) {
      const nextPeriodId = periods[currentIndex + 1].id;
      this.periodService.fetchSubjectsForPeriod(nextPeriodId).subscribe();
    }
  }

deleteCurrentPeriod() {
    const currentId = this.periodService.getCurrentPeriodId();
    const oldPeriods = this.periodService.getCurrentPeriodsValue();
    const currentIndex = oldPeriods.findIndex(p => p.id === currentId);

    if (!currentId) return;

    this.periodService.deletePeriod(currentId).subscribe({
      next: (updatedPeriods: IPeriod[]) => {
        
        if (updatedPeriods.length === 0) {
           window.location.reload(); 
           return;
        }

        let nextIndex = currentIndex;

        if (nextIndex >= updatedPeriods.length) {
            nextIndex = updatedPeriods.length - 1;
        }

        const nextPeriod = updatedPeriods[nextIndex];
        this.periodService.fetchSubjectsForPeriod(nextPeriod.id).subscribe();
      },
      error: (err) => console.error("Erro ao excluir", err)
    });
  }

  createPeriod() {
    this.periodService.createPeriod().subscribe({
      next: (newPeriod) => {
        this.periodService.fetchSubjectsForPeriod(newPeriod.id).subscribe();
      },
      error: (err) => console.error(err)
    });
  }

  private _capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
}