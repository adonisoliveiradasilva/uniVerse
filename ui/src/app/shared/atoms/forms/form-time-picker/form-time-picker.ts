import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-form-time-picker',
  imports: [CommonModule],
  templateUrl: './form-time-picker.html',
  styleUrl: './form-time-picker.scss'
})
export class FormTimePicker {
  @Input() label!: string;
  @Input() loading: boolean = false;

  @Output() onTimeChange = new EventEmitter<{start: string, end: string}>();

  private startValue: string = '';
  private endValue: string = '';

  updateStart(value: string) {
    this.startValue = value;
    this._emit();
  }

  updateEnd(value: string) {
    this.endValue = value;
    this._emit();
  }

  private _emit() {
    this.onTimeChange.emit({
        start: this.startValue,
        end: this.endValue
    });
  }
}