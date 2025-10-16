import { Component, Input } from '@angular/core';
import { ITableColumn, ITableRow } from '../../../core/models/table.model';
import { CommonModule } from '@angular/common';
import { TableRow } from '../../molecules/table-row/table-row';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-table',
  imports: [CommonModule, TableRow],
  templateUrl: './table.html',
  styleUrl: './table.scss'
})
export class Table {
  @Input() rows!: ITableRow[];
  @Input() columns!: ITableColumn[];
  @Input() headers?: string[];
  @Input() context!: 'institution' | 'courses' | 'subjects' | 'user';

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  private _filteredRows: ITableRow[] = [];
  private _paginatedRows: ITableRow[] = [];
  visiblePages: (number | string)[] = [];

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this._filteredRows = [...this.rows]; // começa com todos
    this.totalPages = Math.ceil(this._filteredRows.length / this.itemsPerPage);
    this.updatePage();

    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(term => this.filterRows(term));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchSubject.next(value);
  }

  private filterRows(term: string) {
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

  get getPaginatedRows(): ITableRow[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this._filteredRows.slice(start, end);
  }

  updatePage() {
    this.updateVisiblePages();
  }

  updateVisiblePages() {
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

  goToPage(page: number | string) {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePage();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePage();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage();
    }
  }
}
