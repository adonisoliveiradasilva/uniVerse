import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../../services/rxjs/theme-service/theme-service';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Theme } from '../../../../core/types/theme-type.type';

@Component({
  selector: 'app-button-active-dark-mode',
  imports: [CommonModule, AsyncPipe],  
  templateUrl: './button-active-dark-mode.html',
  styleUrl: './button-active-dark-mode.scss'
})
export class ButtonActiveDarkMode {
  private _themeService = inject(ThemeService);
  public currentTheme$: Observable<Theme> = this._themeService.currentTheme$;

  toggleTheme(): void {
    this._themeService.toggleTheme();
  }
}
