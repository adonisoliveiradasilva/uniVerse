import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IAlert } from '../../../core/models/alert.model';
import { AlertService } from '../../../services/rxjs/alert-service/alert-service';
import { Alert } from '../../atoms/alert/alert';

@Component({
  selector: 'app-alert-surface',
  imports: [CommonModule, Alert],
  templateUrl: './alert-surface.html',
  styleUrl: './alert-surface.scss'
})
export class AlertSurface {
  private _alertService = inject(AlertService);
  
  public alerts$: Observable<IAlert[]> = this._alertService.alerts$;

  public getAlertClass(type: string): string {
    switch (type) {
      case 'success': return 'alert-success';
      case 'error': return 'alert-error';
      case 'warning': return 'alert-warning';
      case 'info': return 'alert-info';
      default: return 'alert-info';
    }
  }
}
