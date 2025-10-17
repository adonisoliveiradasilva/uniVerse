// src/app/services/navigation.service.ts
import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { SIDE_BAR_DATA } from '../../../core/data/side-bar.data';
import { SideBarItem } from '../../../core/models/side-bar-item.model';

interface ActiveNavigationItem {
    title: string;
    subtitle: string;
}

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    private _activeItem = new BehaviorSubject<ActiveNavigationItem | null>(null);
    public activeItem$: Observable<ActiveNavigationItem | null> = this._activeItem.asObservable();

    constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updateActiveItem());
  }

    private updateActiveItem(): void {
        const currentRoute = this.router.url;
        const foundItem = SIDE_BAR_DATA
        .flatMap(section => section.items)
        .find(item => item.route === currentRoute);

        if (foundItem) {
            if (!this._activeItem.value) {
            this._activeItem.next({
            title: foundItem.title,
            subtitle: foundItem.subtitle
            });
        }
        }
    }

      setHeaderInfo(title: string, subtitle: string): void {
        this._activeItem.next({ title, subtitle });
    }
}