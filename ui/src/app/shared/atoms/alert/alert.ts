import { Component, inject, Input, Output } from '@angular/core';
import { EventEmitter } from 'stream';
import { AlertService } from '../../../services/rxjs/alert-service/alert-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  templateUrl: './alert.html',
  styleUrl: './alert.scss'
})
export class Alert {
  @Input() message: string = '';
  @Input() class: string = '';
  @Input() id: number = 0;

  private _alertService = inject(AlertService);

  public dismiss(id: number): void {
    this._alertService.dismissAlert(id);
  }

}
