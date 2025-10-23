import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { ITableColumn, ITableRow } from '../../../core/models/table.model';
import { CommonModule } from '@angular/common';
import { TableRow } from '../../molecules/table-row/table-row';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { TableContextEnum, TableContextType } from '../../../core/types/table-context.type';
import { FormModal } from '../../../services/rxjs/form-modal/form-modal';
import { NoData } from '../../atoms/no-data/no-data';
import { Button } from '../../atoms/buttons/button/button';

@Component({
  selector: 'app-table',
  imports: [CommonModule, TableRow, NoData, Button],
  templateUrl: './table.html',
  styleUrl: './table.scss'
})
export class Table {
  @Input() rows!: ITableRow[];
  @Input() columns!: ITableColumn[];
  @Input() headers?: string[];
  @Input() context!: TableContextType;

  @Input() enableSearch: boolean = true;
  @Input() enablePagination: boolean = true;
  @Input() enableCreate: boolean = true;

  private _formModalService = inject(FormModal)
  private _TableContextEnum = TableContextEnum
  
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  private _filteredRows: ITableRow[] = [];
  visiblePages: (number | string)[] = [];

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // this._filteredRows = [...this.rows];
    // this.totalPages = Math.ceil(this._filteredRows.length / this.itemsPerPage);
    // this.updatePage();

    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(term => this.filterRows(term));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rows']) {
      this._filteredRows = [...this.rows];
      this.totalPages = Math.ceil(this._filteredRows.length / this.itemsPerPage);
      this.currentPage = 1;
      this.updatePage();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get getPaginatedRows(): ITableRow[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this._filteredRows.slice(start, end);
  }

  get getCreateButtonLabel(): string {
    switch (this.context) {
      case this._TableContextEnum.Institution:
        return 'Criar Instituição';
      case this._TableContextEnum.Courses:
        return 'Criar Curso';
      case this._TableContextEnum.Subjects:
        return 'Criar Disciplina';
      case this._TableContextEnum.Department:
        return 'Criar Departamento';
      default:
        return '';
    }
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchSubject.next(value);
  }

  private filterRows(term: string): void {
    if (!term) {
      this._filteredRows = [...this.rows];
    } else {
      this._filteredRows = this.rows.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(term)
        )
      );
    }

    this.currentPage = 1;
    this.totalPages = Math.ceil(this._filteredRows.length / this.itemsPerPage);
    this.updatePage();
  }

  openCreateModal(): void {
    this._formModalService.openModal(this.context, 'create');
  }

  updatePage(): void{
    this.updateVisiblePages();
  }

  updateVisiblePages(): void {
    const pages: (number | string)[] = [];
    if (this.totalPages <= 10) {
      for (let i = 1; i <= this.totalPages; i++) pages.push(i);
    } else {
      const left = Math.max(1, this.currentPage - 2);
      const right = Math.min(this.totalPages, this.currentPage + 2);

      if (left > 1) pages.push(1);
      if (left > 2) pages.push('...');
      for (let i = left; i <= right; i++) pages.push(i);
      if (right < this.totalPages - 1) pages.push('...');
      if (right < this.totalPages) pages.push(this.totalPages);
    }
    this.visiblePages = pages;
  }

  goToPage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePage();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePage();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage();
    }
  }

}
