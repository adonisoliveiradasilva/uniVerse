import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService{
  private _sidebarOpen$ = new BehaviorSubject<boolean>(true);

  get sidebarOpen$() {
    return this._sidebarOpen$.asObservable();
  }

  constructor() {
    const isSideBarOpen = localStorage.getItem('isSideBarOpen');
    if (isSideBarOpen !== null) {
      this._sidebarOpen$.next(isSideBarOpen === 'true');
    } else {
      this._sidebarOpen$.next(true);
    }
  }

  toggleSidebar() {
    this._sidebarOpen$.next(!this._sidebarOpen$.value);
    localStorage.setItem('isSideBarOpen', this._sidebarOpen$.value ? 'true' : 'false')
  }
}
