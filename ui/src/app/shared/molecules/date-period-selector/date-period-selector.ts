import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePeriodSelectorButton } from '../../atoms/date-period-selector/date-period-selector-button/date-period-selector-button';
import { DatePeriodSelectorLabel } from '../../atoms/date-period-selector/date-period-selector-label/date-period-selector-label';
import { Button } from '../../atoms/buttons/button/button';

@Component({
  selector: 'app-date-period-selector',
  imports: [DatePeriodSelectorButton, DatePeriodSelectorLabel, Button],
  templateUrl: './date-period-selector.html',
  styleUrl: './date-period-selector.scss'
})
export class DatePeriodSelector {
  @Input() label!: string | null;
  @Output() navigate = new EventEmitter<'left' | 'right'>();
  @Output() create = new EventEmitter<void>();
  
  onClick(direction: 'left' | 'right'): void {
    this.navigate.emit(direction);
  }

  onCreate(): void {
    this.create.emit();
  }
}
