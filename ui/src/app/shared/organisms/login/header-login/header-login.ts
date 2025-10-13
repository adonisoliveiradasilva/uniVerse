import { Component } from '@angular/core';
import { LoginLogo } from '../../../atoms/login/login-logo/login-logo';

@Component({
  selector: 'app-header-login',
  imports: [LoginLogo],
  templateUrl: './header-login.html',
  styleUrl: './header-login.scss'
})
export class HeaderLogin {

}
