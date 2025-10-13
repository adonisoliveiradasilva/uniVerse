import { Component } from '@angular/core';
import { BodyLogin } from '../../shared/organisms/login/body-login/body-login';
import { HeaderLogin } from '../../shared/organisms/login/header-login/header-login';

@Component({
  selector: 'app-page-login',
  imports: [ HeaderLogin, BodyLogin],
  templateUrl: './page-login.html',
  styleUrl: './page-login.scss'
})
export class PageLogin {

}
