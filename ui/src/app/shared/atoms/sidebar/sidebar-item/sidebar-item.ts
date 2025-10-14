import { Component, Input } from '@angular/core';
import { SideBarSection } from '../../../../core/models/side-bar-item.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar-item',
  imports: [CommonModule],
  templateUrl: './sidebar-item.html',
  styleUrl: './sidebar-item.scss'
})
export class SidebarItem {
  @Input() item!: SideBarSection;

}
