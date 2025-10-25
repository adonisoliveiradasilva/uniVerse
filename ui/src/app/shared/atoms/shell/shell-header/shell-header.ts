import { Component, inject, Input } from '@angular/core';
import { NavigationService } from '../../../../services/rxjs/navigation-service/navigation-service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shell-header',
  imports: [CommonModule],
  templateUrl: './shell-header.html',
  styleUrl: './shell-header.scss'
})
export class ShellHeader {
  @Input() title: string = '';
  @Input() subtitle: string = '';

  private _navigationService = inject(NavigationService)
  private _activeItemSubscription: Subscription | undefined;

  pageTitle: string = 'Bem-vindo!';
  pageSubtitle: string = 'Acompanhe seu progresso.';

  ngOnInit(): void {
    this._navigationService.activeItem$.subscribe(info => {
      if (info) {
        this.pageTitle = info.title;
        this.pageSubtitle = info.subtitle;
      }
    });
  }

  get getTitle(): string{
    return this.title || this.pageTitle;
  }

  get getSubtitle(): string{
    return this.subtitle || this.pageSubtitle;
  }

  ngOnDestroy(): void {
    this._activeItemSubscription?.unsubscribe();
  }
}
