import { Injectable, Renderer2, RendererFactory2, inject, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { AuthService } from '../../api/auth-service/auth-service';
import { UserData } from '../../../core/models/auth.model';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService implements OnDestroy {
  private _http = inject(HttpClient);
  private _authService = inject(AuthService);
  private _renderer: Renderer2;
  
  private readonly THEME_KEY = 'app-theme';
  private _apiUrl = `${environment.apiUrl}/preferences`; 

  private _theme$ = new BehaviorSubject<Theme>(this._getInitialTheme());
  public currentTheme$ = this._theme$.asObservable();

  private _authSubscription: Subscription;

  constructor(rendererFactory: RendererFactory2) {
    this._renderer = rendererFactory.createRenderer(null, null);
    
    this._applyTheme(this._getInitialTheme());

    this._authSubscription = this._authService.currentUser$.subscribe((user: UserData | null) => {
      if (user && user.theme) {
        this._syncTheme(user.theme);
      } else if (!user) {
        const localTheme = this._getInitialTheme();
        this._syncTheme(localTheme);
      }
    });
  }

  private _getInitialTheme(): Theme {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light';
  }

  private _applyTheme(theme: Theme): void {
    if (theme === 'dark') {
      this._renderer.addClass(document.body, 'dark-theme');
    } else {
      this._renderer.removeClass(document.body, 'dark-theme');
    }
  }

  private _syncTheme(theme: Theme): void {
    localStorage.setItem(this.THEME_KEY, theme);
    this._theme$.next(theme);
    this._applyTheme(theme);
  }

  public toggleTheme(): void {
    const newTheme = this._theme$.value === 'light' ? 'dark' : 'light';
    
    localStorage.setItem(this.THEME_KEY, newTheme);
    this._theme$.next(newTheme);
    this._applyTheme(newTheme);

    if (this._authService.isLoggedIn()) {
      this.saveThemeToApi(newTheme).subscribe({
        next: () => console.log('Tema salvo na API'),
        error: (err) => console.error('Falha ao salvar tema na API', err)
      });
    }
  }

  private saveThemeToApi(theme: Theme): Observable<any> {
    return this._http.put(this._apiUrl, { theme: theme });
  }

  ngOnDestroy(): void {
    if (this._authSubscription) {
      this._authSubscription.unsubscribe();
    }
  }
}