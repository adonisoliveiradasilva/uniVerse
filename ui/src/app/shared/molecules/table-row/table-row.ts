import { Component, Input } from '@angular/core';
import { TableTd } from '../../atoms/table-td/table-td';
import { CommonModule } from '@angular/common';
import { ITableColumn, ITableRow } from '../../../core/models/table.model';
import { TableContextType } from '../../../core/types/table-context.type';

@Component({
  selector: 'tr[app-table-row]',
  standalone: true,
  imports: [CommonModule, TableTd],  
  templateUrl: './table-row.html',
  styleUrl: './table-row.scss'
})
export class TableRow {
  @Input() row!: ITableRow;
  @Input() columns!: ITableColumn[];  
  @Input() context!: TableContextType;
  @Input() isLastRow: boolean = false;

  getTdValue(columnKey: string | keyof ITableRow): string | number {
    if (Object.keys(this.row).includes(columnKey as string)) {
      return this.row[columnKey as keyof ITableRow];
    }
    
    if (columnKey === 'action') {
      return 'Editar';
    }
    
    return '';
  }
}
