import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/api/auth-service/auth-service';
import { ThemeService } from './services/rxjs/theme-service/theme-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{
  protected readonly title = signal('my_universe');

  private _authService = inject(AuthService);
  private _themeService = inject(ThemeService); 

  ngOnInit(): void {
    this._authService.initUser(); 
  }
}
