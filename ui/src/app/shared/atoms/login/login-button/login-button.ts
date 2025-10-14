import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-button',
  imports: [],
  templateUrl: './login-button.html',
  styleUrl: './login-button.scss'
})
export class LoginButton {
  @Input() label: string = 'Login';

  private _router = inject(Router);

  onClick() {
    this._router.navigate(['/']);
  }
}
