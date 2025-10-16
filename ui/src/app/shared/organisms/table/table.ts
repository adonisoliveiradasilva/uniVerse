import { Component, Input } from '@angular/core';
import { ITableColumn, ITableRow } from '../../../core/models/table.model';
import { CommonModule } from '@angular/common';
import { TableRow } from '../../molecules/table-row/table-row';

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
  private _paginatedRows: ITableRow[] = [];
  visiblePages: (number | string)[] = [];

  ngOnInit() {
    this.totalPages = Math.ceil(this.rows.length / this.itemsPerPage);
    this.updatePage();
  }

  get getPaginatedRows() {
    return this._paginatedRows;
  }


  updatePage() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this._paginatedRows = this.rows.slice(start, end);
    this.updateVisiblePages();
  }

  updateVisiblePages() {
    const pages: (number | string)[] = [];
    if (this.totalPages <= 10) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const left = Math.max(1, this.currentPage - 2);
      const right = Math.min(this.totalPages, this.currentPage + 2);

      if (left > 1) pages.push(1);
      if (left > 2) pages.push('...');

      for (let i = left; i <= right; i++) {
        pages.push(i);
      }

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
