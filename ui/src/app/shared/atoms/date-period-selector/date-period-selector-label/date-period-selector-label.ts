import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-date-period-selector-label',
  imports: [CommonModule],
  templateUrl: './date-period-selector-label.html',
  styleUrl: './date-period-selector-label.scss'
})
export class DatePeriodSelectorLabel {
  @Input() label!: string | null;
  
}
