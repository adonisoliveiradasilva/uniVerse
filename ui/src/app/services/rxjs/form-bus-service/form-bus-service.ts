import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormBusService {
  private _submitForm$ = new Subject<void>();
  private _formPayload$ = new Subject<any>();

  get submitForm$() {
    return this._submitForm$.asObservable();
  }

  get formPayload$() {
    return this._formPayload$.asObservable();
  }

  triggerSubmit() {
    this._submitForm$.next();
  }

  sendPayload(payload: any) {
    this._formPayload$.next(payload);
  }
}
