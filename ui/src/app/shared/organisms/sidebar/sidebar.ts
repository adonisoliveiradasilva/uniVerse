import { Component } from '@angular/core';
import { SIDE_BAR_DATA } from '../../../core/data/side-bar.data';
import { SideBarSection } from '../../../core/models/side-bar-item.model';
import { CommonModule } from '@angular/common';
import { SidebarItem } from '../../atoms/sidebar/sidebar-item/sidebar-item';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, SidebarItem],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  private _items: SideBarSection[] = SIDE_BAR_DATA

  get getItems() {
    return this._items;
  }
}
