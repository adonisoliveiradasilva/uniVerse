import { Component, inject, Input } from '@angular/core';
import { SideBarItem, SideBarSection } from '../../../../core/models/side-bar-item.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationService } from '../../../../services/rxjs/navigation/navigation';
import { SidebarService } from '../../../../services/rxjs/sidebar-service/sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar-item',
  imports: [CommonModule],
  templateUrl: './sidebar-item.html',
  styleUrl: './sidebar-item.scss'
})
export class SidebarItem {
  @Input() item!: SideBarSection;

  isOpen = false;

  private _router = inject(Router)
  private _navigationService = inject(NavigationService)
  private _sidebarService = inject(SidebarService);
  private _subscription = new Subscription();
  
  
  ngOnInit(): void {
    this._subscription.add(
      this._sidebarService.sidebarOpen$.subscribe(open => {
        this.isOpen = open;
      })
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  onClick(item: SideBarItem): void {
    this._navigationService.setHeaderInfo(item.title, item.subtitle);
    this._router.navigate([item.route])
  }

  isActive(route: string): boolean{
    return this._router.url == route
  }

}
