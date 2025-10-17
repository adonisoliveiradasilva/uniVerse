import { Component, inject } from '@angular/core';
import { SIDE_BAR_DATA } from '../../../core/data/side-bar.data';
import { SideBarSection } from '../../../core/models/side-bar-item.model';
import { CommonModule } from '@angular/common';
import { SidebarItem } from '../../atoms/sidebar/sidebar-item/sidebar-item';
import { SidebarService } from '../../../services/rxjs/sidebar-service/sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, SidebarItem],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  private _items: SideBarSection[] = SIDE_BAR_DATA
  private _sidebarService = inject(SidebarService);
  private _subscription = new Subscription();

  isOpen = true;
  
  get getItems() {
    return this._items;
  }

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

  toggleSidebar() {
    this._sidebarService.toggleSidebar();
  }
}
