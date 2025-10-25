import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertType, IAlert } from '../../../core/models/alert.model';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private _alerts = new BehaviorSubject<IAlert[]>([]);
  
  public readonly alerts$: Observable<IAlert[]> = this._alerts.asObservable();

  private _idCounter = 0;

  public showAlert(message: string, type: AlertType, duration: number = 5000): void {
    const newAlert: IAlert = {
      id: this._idCounter++,
      message,
      type
    };

    const currentAlerts = this._alerts.getValue();
    this._alerts.next([...currentAlerts, newAlert]);

    if (duration > 0) {
      setTimeout(() => {
        this.dismissAlert(newAlert.id);
      }, duration);
    }
  }

  public success(message: string, duration?: number): void {
    this.showAlert(message, 'success', duration);
  }

  public error(message: string, duration?: number): void {
    this.showAlert(message, 'error', duration);
  }

  public warn(message: string, duration?: number): void {
    this.showAlert(message, 'warning', duration);
  }

  public info(message: string, duration?: number): void {
    this.showAlert(message, 'info', duration);
  }

  public dismissAlert(id: number): void {
    const currentAlerts = this._alerts.getValue();
    const updatedAlerts = currentAlerts.filter(alert => alert.id !== id);
    this._alerts.next(updatedAlerts);
  }
}
