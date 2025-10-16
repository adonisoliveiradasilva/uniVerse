import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableTdType } from '../../../core/models/table-td.type';

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
  @Input() context!: 'institution' | 'courses' | 'subjects' | 'user';
  @Input() isLastRow: boolean = false;
  @Input() objectId!: number;

  TableTdType = TableTdType;

  get getClasses(): string[] {
    return [
      this.type,
      this.isLastRow ? 'last-row-cell' : ''
    ].filter(Boolean);
  }
}
