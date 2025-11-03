import { Component } from '@angular/core';
import { BodyLogin } from '../../shared/organisms/login/body-login/body-login';
import { HeaderLogin } from '../../shared/organisms/login/header-login/header-login';
import { Loading } from '../../shared/atoms/loading/loading';

@Component({
  selector: 'app-page-login',
  imports: [ HeaderLogin, BodyLogin, Loading],
  templateUrl: './page-login.html',
  styleUrl: './page-login.scss'
})
export class PageLogin {

}
