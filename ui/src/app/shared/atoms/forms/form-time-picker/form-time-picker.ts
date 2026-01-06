import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-time-picker',
  imports: [CommonModule],
  templateUrl: './form-time-picker.html',
  styleUrl: './form-time-picker.scss'
})
export class FormTimePicker {
  @Input() label!: string;
  @Input() loading: boolean = false;

}
