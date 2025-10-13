import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-login-button',
  imports: [],
  templateUrl: './login-button.html',
  styleUrl: './login-button.scss'
})
export class LoginButton {
  @Input() label: string = 'Login';
}
