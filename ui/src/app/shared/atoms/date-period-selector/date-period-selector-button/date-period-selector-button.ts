import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-date-period-selector-button',
  imports: [CommonModule],
  templateUrl: './date-period-selector-button.html',
  styleUrl: './date-period-selector-button.scss'
})
export class DatePeriodSelectorButton {
  @Input() direction!: 'left' | 'right';
  @Output() navigate = new EventEmitter<'left' | 'right'>();

  onClick(): void{
    this.navigate.emit(this.direction);
  }
}
