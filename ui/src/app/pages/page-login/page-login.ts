import { Component } from '@angular/core';
import { BodyLogin } from '../../shared/organisms/login/body-login/body-login';
import { HeaderLogin } from '../../shared/organisms/login/header-login/header-login';
import { Loading } from '../../shared/atoms/loading/loading';
import { AlertSurface } from '../../shared/organisms/alert-surface/alert-surface';
import { ButtonActiveDarkMode } from '../../shared/atoms/buttons/button-active-dark-mode/button-active-dark-mode';

@Component({
  selector: 'app-page-login',
  imports: [ HeaderLogin, BodyLogin, Loading, AlertSurface, ButtonActiveDarkMode],
  templateUrl: './page-login.html',
  styleUrl: './page-login.scss'
})
export class PageLogin {

}
