import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableTdType } from '../../../core/types/table-td.type';
import { TableContextType } from '../../../core/types/table-context.type';

@Component({
  selector: 'td[app-table-td]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-td.html',
  styleUrl: './table-td.scss',
  host: {
    '[class]': 'getClasses.join(" ")'
  }
})
export class TableTd {
  @Input() value!: string | number;
  @Input() type: TableTdType = TableTdType.Text;
  @Input() isFirst: boolean = false;
  @Input() isLast: boolean = false;
  @Input() context!: TableContextType;
  @Input() isLastRow: boolean = false;
  @Input() objectId!: string;

  TableTdType = TableTdType;

  get getClasses(): string[] {
    return [
      this.type,
      this.isLastRow ? 'last-row-cell' : ''
    ].filter(Boolean);
  }
}
