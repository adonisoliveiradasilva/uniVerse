import { Component, inject } from '@angular/core';
import { NavigationService } from '../../../../services/navigation/navigation';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shell-header',
  imports: [],
  templateUrl: './shell-header.html',
  styleUrl: './shell-header.scss'
})
export class ShellHeader {
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

  ngOnDestroy(): void {
    this._activeItemSubscription?.unsubscribe();
  }
}
