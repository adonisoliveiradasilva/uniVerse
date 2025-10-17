import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private _sidebarOpen$ = new BehaviorSubject<boolean>(true);

  get sidebarOpen$() {
    return this._sidebarOpen$.asObservable();
  }

  toggleSidebar() {
    this._sidebarOpen$.next(!this._sidebarOpen$.value);
  }

  openSidebar() {
    this._sidebarOpen$.next(true);
  }

  closeSidebar() {
    this._sidebarOpen$.next(false);
  }
}
